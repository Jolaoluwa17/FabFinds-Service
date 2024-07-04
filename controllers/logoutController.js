const User = require("../models/User");

const handleLogout = async (req, res) => {
  // On client, also delete the accessToken
  const cookies = req.cookies;

  if (cookies.accessToken !== "") {
    res.clearCookie("accessToken", {
      httpOnly: true,
      maxAge: 2 * 60 * 1000,
      sameSite: "None",
      secure: true,
    });
    return res.sendStatus(204);
  }
  if (cookies.refreshToken === "") {
    return res.sendStatus(204);
  }
  const refreshToken = cookies.refreshToken;

  // Is refreshToken in db?
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("accessToken", {
      httpOnly: true,
      maxAge: 2 * 60 * 1000,
      sameSite: "None",
      secure: true,
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: true,
    });
    return res.sendStatus(204);
  }

  // Delete refreshToken in db
  foundUser.refreshToken = null;
  const result = await foundUser.save();
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: 2 * 60 * 1000,
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  //secure: true - only serves on https
  res.sendStatus(200);
};

module.exports = { handleLogout };
