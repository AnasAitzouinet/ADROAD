const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index.ejs');
  });

  router.get('/driver', (req, res) => {
    res.render('driver_lgn_reg.ejs');
  });

    
module.exports = router;