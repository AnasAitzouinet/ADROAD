"use strict";

const express = require("express");
var minify = require("express-minify");
// const MainRoute = require("./routes/index");
// const driver = require("./routes/driver");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const mysql = require("mysql2");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const Chart = require('chart.js/auto');
const Canvas = require('canvas');
// const ejs = require('ejs');
// const fs = require('fs');
// const _ = require('underscore');

// // define the include function
// ejs.filters.include = function(file, data) {
//   const filePath = path.join(__dirname, file);
//   const fileContent = fs.readFileSync(filePath, 'utf8');
//   return ejs.render(fileContent, data);
// };

const app = express();
app.use(minify({
  cache: false,
  uglifyJsModule: null,
  errorHandler: null,
  jsMatch: /javascript/,
  cssMatch: /css/,
  jsonMatch: /json/,
  sassMatch: /scss/,
  lessMatch: /less/,
  stylusMatch: /stylus/,
  coffeeScriptMatch: /coffeescript/
}));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//------ Routes -------//
app.set("view engine", "ejs");
app.use(express.static("public"));
// app.use("/", MainRoute);
// app.use("/", driver);
app.get('/', (req, res) => {
  res.render('index.ejs');
});
app.get('/driver', (req, res) => {
  res.render('driver_lgn_reg.ejs');
});
app.get('/logadmin', (req, res) => {
  res.render("admin/logadmin.ejs");
});
app.get('/admin/tabledb', (req, res) => {
  res.render("admin/tables-datatables.ejs");
});
app.get('/BecomeDriver', (req, res) => {
  res.render('driver_info.ejs');
});
//--------- Login Auth ---------- //
app.use(express.urlencoded({
  extended: true
}));
const secretKey = crypto.randomBytes(32).toString("hex");
// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "Bustguy123+",
//   database: "userDb",
// });
const connection = mysql.createConnection({
  host: "eu-cdbr-west-03.cleardb.net",
  user: "b23c8a045bfb66",
  password: "a2b3cd99",
  database: "heroku_e89598fb25b1a5e"
});
app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore({
    host: "eu-cdbr-west-03.cleardb.net",
    user: "b23c8a045bfb66",
    password: "a2b3cd99",
    database: "heroku_e89598fb25b1a5e"
  }),
  cookie: {
    secure: false,
    maxAge: 30 * 60 * 1000
  }
}));
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
    connection.query("SELECT * FROM drivers WHERE id = ?", [req.session.userId], function (error, results, fields) {
      if (error) throw error;
      // console.log(results[0].profile_pic);
      // console.log(results[0]);
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
        image: data.profile_pic
      });
    });
  } else {
    res.redirect("/driver");
  }
});
//----------- visitors ----------//
app.use((req, res, next) => {
  if (!req.session.visitorId) {
    // Generate a unique visitor ID and store it in the session
    req.session.visitorId = Math.floor(Math.random() * 1000000);
    // Update the visitor count in the database
    connection.query("UPDATE userdata SET visitors = visitors + 1 WHERE id = 1", (error, results, fields) => {
      if (error) {
        console.error("Error updating visitor count in database", error);
      }
    });
  }
  next();
});
//-------------- update infos ---------------//
const storagee = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  }
});
const uploadd = multer({
  storage: storagee
});
app.post("/userinfo", uploadd.array("myFile", 4), (req, res) => {
  if (req.session.loggedin) {
    const email = req.body.email;
    const fname = req.body.f_name;
    const lname = req.body.l_name;
    const age = req.body.age;
    const num = req.body.num;
    // const cin = req.body.cin;
    const username = fname + lname;
    let sql = "UPDATE drivers SET username = ?, f_name = ?, l_name = ?, age = ?, phone_number = ?,  email = ? , pic1 = ?, pic2 = ?, pic3 = ?, pic4 = ? WHERE id = ?";
    let values = [username, fname, lname, age, num, email];
    for (let i = 0; i < 4; i++) {
      if (req.files[i]) {
        values.push("/images/" + req.files[i].filename);
      } else {
        values.push(null);
      }
    }
    values.push(req.session.userId);
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
  }
});
const upload = multer({
  storage: storage
}).single("image");
app.post("/upload", function (req, res) {
  // Check if a user is logged in
  if (!req.session.userId) {
    return res.status(401).send({
      error: "Unauthorized. Please log in first."
    });
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
      res.status(200).send({
        status: "success"
      });
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
        let sql = "INSERT INTO drivers (f_name, email, password) VALUES (?,?,?)";
        let values = [f_name, email, password];
        connection.query(sql, values, function (err, result) {
          if (err) throw err;
          console.log("User registered successfully!");
          req.session.loggedin = true;
          req.session.userId = result.insertId;
          connection.query("UPDATE userdata SET created_acc = created_acc + 1 WHERE id = 1", (error, resultss, fields) => {
            if (error) {
              console.error("Error updating created_acc count in database", error);
            }
          });
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
      console.log(result);
      req.session.userId = result.id;
      connection.query("UPDATE userdata SET created_acc = created_acc + 1 WHERE id = 1", (error, resultss, fields) => {
        if (error) {
          console.error("Error updating created_acc count in database", error);
        }
      });
      res.redirect("/clients");
    });
  }
});

//-------------- clients -----------------//
app.get("/clients", async (req, res) => {
  connection.query("SELECT * FROM drivers", (error, result) => {
    if (error) throw error;
    res.render("clients.ejs", {
      drivers: result
    });
  });
});
app.get("/clients/:id", async (req, res) => {
  connection.query("SELECT * FROM drivers WHERE id = ?", [req.params.id], (error, result) => {
    if (error) throw error;
    if (result.length > 0) {
      console.log(result[0]);
      res.render("client-detail.ejs", {
        driver: result
      });
    } else {
      res.status(404).send("Driver not found");
    }
  });
});

//------------- SuperAdmin ---------------//
// Load the data and render the page
app.get('/admin', (req, res) => {
  connection.query('SELECT * FROM userdata', (err, result) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }
    const visitorCount = result[0].visitors;
    const accountCount = result[0].created_acc;
    const canvas = Canvas.createCanvas(500, 500);
    const ctx = canvas.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['All-time visitors', 'Created accounts'],
        datasets: [{
          label: 'Count',
          data: [visitorCount, accountCount],
          backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    const chartUrl = canvas.toDataURL();
    res.render('Admin/index.ejs', {
      visitors: result[0].visitors,
      Drivers: result[0].created_acc,
      clients: result[0].clients,
      chart: chartUrl
    });
  });
});
app.post("/log", async (req, res) => {
  const username = req.body.username;
  const pass = req.body.psd;
  const query = `SELECT * FROM sadmin WHERE username = '${username}' AND password = '${pass}'`;
  try {
    const results = await connection.promise().query(query);
    if (results[0].length > 0) {
      const driver = results[0][0];
      req.session.admin = true;
      // req.session.userId = results[0][0].id;
      res.redirect("/admin");
    } else {
      res.send("Incorrect username and/or password");
    }
  } catch (error) {
    console.error(error);
    res.send("An error occurred while checking the login information");
  }
});
//---------- Server is on ---------//
app.listen(1000, () => {
  console.log("Server is On!!");
});