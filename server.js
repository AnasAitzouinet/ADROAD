const express = require('express');
var minify = require('express-minify');
const MainRoute = require('./routes/index');

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


app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/',MainRoute)

app.listen(1000,()=>{
    console.log("Server is On!!");
})