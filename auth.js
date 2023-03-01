const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Sequelize = require('sequelize');

const { sequelize, User, Client, Driver, Location } = require("./db"); // import the sequelize instance and models

router.use(express.urlencoded({ extended: true })); // Add this line to parse urlencoded form data

router.post("/register/con", async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    if (!password) {
      return res.status(400).send('Password is required');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try{
      const user = await User.create({ email, password: hashedPassword });
      res.json({ id: user.id });
      console.log('works')
    } catch (error){
      console.log('Error creating user:', error);
      res.status(500).send('Error creating user');
    }
  });

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username: username } });

  if (!user) res.status(400).json({ error: "User Doesn't Exist" });

  const dbPassword = user.password;
  bcrypt.compare(password, dbPassword).then((match) => {
    if (!match) {
      res
        .status(400)
        .json({ error: "Wrong Username and Password Combination!" });
    } else {
      const accessToken = createTokens(user);

      res.cookie("access-token", accessToken, {
        maxAge: 60 * 60 * 24 * 30 * 1000,
        httpOnly: true,
      });

      res.json("LOGGED IN");
    }
  });
});

module.exports = router;
