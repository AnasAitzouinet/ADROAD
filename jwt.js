const { sign, verify } = require("jsonwebtoken");
router.use(express.json());

const createTokens = (user) => {
  const accessToken = sign(
    { username: user.username, id: user.id },
    "jwtsecretplschange"
  );

  return accessToken;
};

const validateToken = (req, res, next) => {
  const accessToken = req.cookies["access-token"];

  if (!accessToken)
    return res.status(400).json({ error: "User not Authenticated!" });

  try {
    const validToken = verify(accessToken, "jwtsecretplschange");
    if (validToken) {
      req.authenticated = true;
      return next();
    }
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};
const getUserData = async (req, res, next) => {
    const accessToken = req.cookies["access-token"];
  
    if (!accessToken) {
      return res.status(401).json({ error: "User not authenticated" });
    }
  
    try {
      const decodedToken = verify(accessToken, "jwtsecretplschange");
      const user = await User.findOne({ where: { email: decodedToken.email } }); // Search for a user with the email in the decoded token
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      req.user = user;
      next();
    } catch (err) {
      return res.status(400).json({ error: err });
    }
  };
module.exports = { createTokens, validateToken };