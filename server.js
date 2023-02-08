const express = require('express');
var minify = require('express-minify');
const MainRoute = require('./routes/index');
const driver = require('./routes/driver');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const mysql = require('mysql2');
const crypto = require('crypto');
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
    coffeeScriptMatch: /coffeescript/,
  }));

//------ Routes -------//
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/',MainRoute);
app.use('/',driver);




//--------- Login Auth ---------- //
  app.use(express.urlencoded({ extended: true }));
  const secretKey = crypto.randomBytes(32).toString('hex');
  const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Bustguy123+',
      database: 'userDb'
    });
  app.use(session({
      secret: secretKey,
      resave: false,
      saveUninitialized:false,
      store: new MySQLStore({
          host: 'localhost',
          user: 'root',
          password: 'Bustguy123+',
          database: 'userDb'
      }),
      cookie: { secure: false }
  })) 
  app.post('/login_driver', (req,res)=>{
      const email = req.body.email;
      const pswd = req.body.password;
      const query = `SELECT * FROM Users WHERE email = '${email}' AND password ='${pswd}'`;
      connection.query(query,(er,results)=>{
          if (er) throw er;
          if (results.length>0){
              req.session.loggedin = true;
              req.session.email = email;
              res.redirect('/');
          }else{
              res.send('Incorrect email and/or password')
          }
      })
  })
  app.get('/dashboard',(req,res) =>{
      if(!req.session.email){
          res.redirect('/');
      }else{
          const email = req.session.email;
          const query = `SELECT email FROM users WHERE email = '${email}'`;
          connection.query(query, (err, result) => {
              if (err) throw err;
              const name = result[0].email;
              res.render('dashboard.ejs', { name: name });
          });
      }
  })
 
//-------------- Register Auth ------------//
app.post('/register', function(req, res) {
  //let firstName = req.body.firstName;
  let Username = req.body.Username;
  let email = req.body.email;
  let password = req.body.password;

  let sql = 'INSERT INTO users (Username, email, password) VALUES (?,?,?)';
  let values = [ Username, email, password];

  connection.query(sql, values, function(err, result) {
    if (err) throw err;
    console.log('User registered successfully!');
    req.session.loggedin = true;
    req.session.email = email;
    res.redirect('/');
  });
});




//---------- Server is on ---------//
app.listen(1000,()=>{
    console.log("Server is On!!");
})