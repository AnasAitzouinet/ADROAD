const express = require("express");
var minify = require("express-minify");
const session = require("express-session");
const mysql = require("mysql2");
const path = require("path");
const Chart = require("chart.js/auto");
const Canvas = require("canvas");
const port = process.env.PORT || 1000;
const app = express();
app.use(express.json());
const { getUserData, validateToken, errs } = require("./jwt");

app.use(express.urlencoded({ extended: true }));
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
const cookieParser = require("cookie-parser");
const auth = require("./auth");
const db = require("./database");
app.use(auth);
app.use(cookieParser());

//------ Routes -------//
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index.ejs");
});
app.get("/register", (req, res) => {
  res.render("auth/Auth-Sign/sign-up.ejs");
});
app.get("/login", (req, res) => {
  res.render("auth/Auth-Sign/sign-in.ejs");
});

app.get('/dashboard', validateToken,(req,res)=>{
  res.render("auth/index.ejs");
})

app.get("/logout", (req, res) => {
  // Clear JWT cookie
  if (req.cookies["access-token"]) {
    // Clear the 'access-token' cookie
    res.clearCookie("access-token");
  }
  // Redirect the user to the login page
  res.redirect("/login");
});

app.get("/error", errs, (req, res) => {
  res.render("auth/errors/error-404.ejs");
});
app.get("/BecomeDriver", (req, res) => {
  res.render("driver_info.ejs");
});
//--------- Login Auth ---------- //

//------------- SuperAdmin ---------------//
// Load the data and render the page
app.get("/admin", (req, res) => {
  connection.query("SELECT * FROM userdata", (err, result) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }

    const visitorCount = result[0].visitors;
    const accountCount = result[0].created_acc;

    const canvas = Canvas.createCanvas(500, 500);
    const ctx = canvas.getContext("2d");

    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["All-time visitors", "Created accounts"],
        datasets: [
          {
            label: "Count",
            data: [visitorCount, accountCount],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
            ],
            borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    const chartUrl = canvas.toDataURL();

    res.render("Admin/index.ejs", {
      visitors: result[0].visitors,
      Drivers: result[0].created_acc,
      clients: result[0].clients,
      chart: chartUrl,
    });
  });
});

//---------- Server is on ---------//
app.listen(port, () => {
  console.log("Server is On!!");
});
