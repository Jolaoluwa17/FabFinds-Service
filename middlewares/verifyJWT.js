const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.cookies.accessToken;
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  // console.log(authHeader); // Bearer token
  jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid Token" });
    }
    req.user = decoded.UserInfo.name;
    req.roles = decoded.UserInfo.roles;
    next();
  });
};

module.exports = verifyJWT;
