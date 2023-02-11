const express = require("express");
var minify = require("express-minify");
const MainRoute = require("./routes/index");
const driver = require("./routes/driver");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const mysql = require("mysql2");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
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
  const driver_check = req.body;
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
          console.log(req.session);
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
  }
});
app.get("/dashboard", (req, res) => {
  if (req.session.loggedin) {
    connection.query(
      "SELECT * FROM drivers WHERE id = ?",
      [req.session.userId],
      function (error, results, fields) {
        if (error) throw error;
        // console.log(results[0])
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
        });
      }
    );
  } else {
    res.redirect("/driver");

  }
});

//-------------- update infos ---------------//
app.post("/userinfo", (req, res) => {
  if (req.session.loggedin) {
    const username = req.body.username;
    const email = req.body.email;
    const fname = req.body.f_name;
    const lname = req.body.l_name;
    const age = req.body.age;
    const num = req.body.num;
    const cin = req.body.cin;

    let sql =
      "UPDATE drivers SET username = ?, f_name = ?, l_name = ?, age = ?, phone_number = ?, cin = ?, email = ? WHERE id = ?";
    let values = [
      username,
      fname,
      lname,
      age,
      num,
      cin,
      email,
      req.session.userId,
    ];

    connection.query(sql, values, function (err, result) {
      if (err) throw err;
      console.log("User got updated!");
      // req.session.loggedin = true;
      // req.session.email = email;
      res.redirect("/dashboard");
    });
  }
});
//-------------- Register Auth ------------//
app.post("/register", async function (req, res) {
  const driver_check = req.body;
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
        res.redirect("/register");
      } else {
        console.log("checked");
        let sql =
          "INSERT INTO drivers (f_name, email, password) VALUES (?,?,?)";
        let values = [f_name, email, password];

        connection.query(sql, values, function (err, result) {
          if (err) throw err;
          console.log("User registered successfully!");
          req.session.loggedin = true;
          req.session.userId = result[0].id;
          res.redirect("/");
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
      req.session.email = email;
      res.redirect("/");
    });
  }
});

//---------- Server is on ---------//
app.listen(1000, () => {
  console.log("Server is On!!");
});
