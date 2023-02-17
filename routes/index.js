const express = require("express");
const router = express.Router();
const app = express();
router.get('/', (req, res) => {
    res.render('index.ejs');
  });

  router.get('/driver', (req, res) => {
    res.render('driver_lgn_reg.ejs');
  });

router.get('/logadmin',(req,res)=>{
  res.render("admin/logadmin.ejs")
});

router.get('/admin/tabledb',(req,res)=>{
  res.render("admin/tables-datatables.ejs")
});
module.exports = router;