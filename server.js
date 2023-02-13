const express = require("express");
var minify = require("express-minify");
const MainRoute = require("./routes/index");
const driver = require("./routes/driver");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const mysql = require("mysql2");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require('path');

const app = express();

app.use(
  minify({
    cache: false,
    uglifyJsModule: null,
    errorHandler: null,
    jsMatch: /javascript/,
    cssMatch: /css/,
    jsonMatch: /json/,
    sassMatch: /scss/,
    lessMatch: /less/,
    stylusMatch: /stylus/,
    coffeeScriptMatch: /coffeescript/,
  })
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//------ Routes -------//
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/", MainRoute);
app.use("/", driver);

//--------- Login Auth ---------- //
app.use(express.urlencoded({ extended: true }));
const secretKey = crypto.randomBytes(32).toString("hex");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Bustguy123+",
  database: "userDb",
});
app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore({
      host: "127.0.0.1",
      user: "root",
      password: "Bustguy123+",
      database: "userDb",
    }),
    cookie: { secure: false, maxAge: 30 * 60 * 1000 },
  })
);

app.post("/login_driver", async (req, res) => {
  const driver_check = req.body.driver_check;
  const email = req.body.email;
  const pswd = req.body.password;
  if (driver_check) {
    const query = `SELECT * FROM drivers WHERE email = '${email}'`;
    try {
      const results = await connection.promise().query(query);
      if (results[0].length > 0) {
        const driver = results[0][0];
        const match = await bcrypt.compare(pswd, driver.password);
        if (match) {
          req.session.loggedin = true;
          req.session.userId = results[0][0].id;
          res.redirect("/dashboard");
        } else {
          res.send("Incorrect email and/or password");
        }
      } else {
        res.send("Incorrect email and/or password");
      }
    } catch (error) {
      console.error(error);
      res.send("An error occurred while checking the login information");
    }
  } else {
    const query = `SELECT * FROM clients WHERE email = '${email}' AND password ='${pswd}'`;
    try {
      const results = await connection.promise().query(query);
      if (results[0].length > 0) {
        const driver = results[0][0];
        const match = await bcrypt.compare(pswd, driver.password);
        if (match) {
          req.session.loggedin = true;
          req.session.userId = results[0].id;
          res.redirect("/clients");
        } else {
          res.send("Incorrect email and/or password");
        }
      } else {
        res.send("Incorrect email and/or password");
      }
    } catch (error) {
      console.error(error);
      res.send("An error occurred while checking the login information");
    }
  }
});
app.get("/dashboard", (req, res) => {
  if (req.session.loggedin) {
    connection.query(
      "SELECT * FROM drivers WHERE id = ?",
      [req.session.userId],
      function (error, results, fields) {
        if (error) throw error;
        console.log(results[0].profile_pic);
        console.log(results[0]);
        data = results[0];
        res.render("dashboard.ejs", {
          fname: data.f_name,
          lname: data.l_name,
          age: data.age,
          email: data.email,
          num: data.phone_number,
          cin: data.cin,
          adress: data.adresse,
          username: data.username,
          image: data.profile_pic,
        });
      }
    );
  } else {
    res.redirect("/driver");
  }
});

//-------------- update infos ---------------//
const storagee = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});
const uploadd = multer({ storage: storagee });
app.post("/userinfo", uploadd.array('myFile', 4), (req, res) => {
  if (req.session.loggedin) {
    const username = req.body.username;
    const email = req.body.email;
    const fname = req.body.f_name;
    const lname = req.body.l_name;
    const age = req.body.age;
    const num = req.body.num;
    const cin = req.body.cin;

    let sql =
      "UPDATE drivers SET username = ?, f_name = ?, l_name = ?, age = ?, phone_number = ?, cin = ?, email = ? , pic1 = ?, pic2 = ?, pic3 = ?, pic4 = ? WHERE id = ?";
    let values = [
      username,
      fname,
      lname,
      age,
      num,
      cin,
      email,
      "/images/" + req.files[0].filename,
      "/images/" + req.files[1].filename,
      "/images/" + req.files[2].filename,
      "/images/" + req.files[3].filename,
      req.session.userId,
    ];

    connection.query(sql, values, function (err, result) {
      if (err) throw err;
      console.log("User got updated!");
      res.redirect("/dashboard");
    });
  }
});
//-------------- insert image --------------//
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg");
  },
});
const upload = multer({ storage: storage }).single("image");

app.post("/upload", function (req, res) {
  // Check if a user is logged in
  if (!req.session.userId) {
    return res.status(401).send({ error: "Unauthorized. Please log in first." });
  }

  upload(req, res, function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).send(err.message);
    }
    let image = req.file;
    console.log("Received image:", image);
    // Save the image to the database
    const sql = "UPDATE drivers SET profile_pic = ? WHERE id = ?";
    connection.query(sql, [image.filename, req.session.userId], (err, result) => {
      if (err) throw err;
      res.status(200).send({ status: "success" });
    });
  });
});

//-------------- Register Auth ------------//
app.post("/register", async function (req, res) {
  const driver_check = req.body.driver_check;
  let f_name = req.body.f_name;
  let email = req.body.email;
  const password = await bcrypt.hash(req.body.password, 10);

  let checksql = "SELECT * FROM drivers WHERE email = ?";
  let chechvalue = [email];
  if (driver_check) {
    connection.query(checksql, chechvalue, function (err, result) {
      if (err) throw err;
      if (result.length) {
        console.log("Email already in use. Please choose a different email.");
        res.redirect("/driver");
      } else {
        console.log("checked");
        let sql =
          "INSERT INTO drivers (f_name, email, password) VALUES (?,?,?)";
        let values = [f_name, email, password];

        connection.query(sql, values, function (err, result) {
          if (err) throw err;
          console.log("User registered successfully!");
          req.session.loggedin = true;
          req.session.userId = result.insertId;
          res.redirect("/driver");
        });
      }
    });
  } else {
    console.log("not checked");
    let sql = "INSERT INTO clients (f_name, email, password) VALUES (?,?,?)";
    let values = [f_name, email, password];

    connection.query(sql, values, function (err, result) {
      if (err) throw err;
      console.log("User registered successfully!");
      req.session.loggedin = true;
      console.log(result)
      req.session.userId = result.id;
      res.redirect("/clients");
    });
  }
});

//-------------- clients -----------------//
app.get('/clients', async(req, res) => {
  connection.query("SELECT * FROM drivers",(error,result)=>{
    if (error) throw error;
    res.render('clients.ejs',{drivers:result});

  })
});

app.get('/clients/:id', async(req, res) => {
  connection.query("SELECT * FROM drivers WHERE id = ?", [req.params.id], (error, result) => {
    if (error) throw error;
    if (result.length > 0) {
      res.render('client-detail.ejs', { driver: result });
    } else {
      res.status(404).send("Driver not found");
    }
  });
});
//---------- Server is on ---------//
app.listen(1000, () => {
  console.log("Server is On!!");
});
