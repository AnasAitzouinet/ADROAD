const express = require("express");
const routerD = express.Router();

routerD.get('/BecomeDriver', (req, res) => {
    res.render('driver_info.ejs');
  });

module.exports = routerD;