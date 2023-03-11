const { sign, verify } = require("jsonwebtoken");

const createTokens = (user) => {
  const accessToken = sign(
    { email: user.email, id: user.id },
    "jwtsecretplschange"
  );

  return accessToken;
};

const validateToken = (req, res, next) => {
  const accessToken = req.cookies["access-token"];

  if (!accessToken) res.redirect("/login");

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
const errs = (req, res, next) => {
  const accessToken = req.cookies["access-token"];
  if (!accessToken) {
    res.redirect("/");
    return;
}
return next();
};
const getUserData = async (req, res, next) => {
  const accessToken = req.cookies["access-token"];

  if (!accessToken) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  try {
    const decodedToken = verify(accessToken, "jwtsecretplschange");
    const user = await Users.findOne({ where: { email: decodedToken.email } }); // Search for a user with the email in the decoded token
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

module.exports = { createTokens, validateToken, errs , getUserData};
