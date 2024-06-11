const jwt = require("jsonwebtoken");
const User = require("../models/User");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  // console.log(cookies)
  if (!cookies?.refreshToken) return res.sendStatus(401);
  const refreshToken = cookies.refreshToken;
  // console.log(refreshToken);

  const foundUser = await User.findOne({ refreshToken });
  if (!foundUser) return res.sendStatus(403); // Forbidden
  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.name !== decoded.name) return res.sendStatus(403);
    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      {
        UserInfo: {
          name: decoded.name,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2m" }
    );
    const maxAge = 2 * 60;
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: maxAge * 1000,
      sameSite: "None",
      secure: true,
    });
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
  });
};

module.exports = { handleRefreshToken };
