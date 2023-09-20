const express = require("express");
const router = express.Router();
const passport = require("passport");
const registerController = require("../controllers/registerController");
const authController = require("../controllers/authController");
const refreshTokenController = require("../controllers/refreshTokenController");

// create a new user
router.post("/user/signup", registerController.handleNewUser);

// create a new admin
router.post("/admin/signup", registerController.handleNewAdmin);

// Sign in with email/username and password for user
router.post("/user/signin", authController.handleUserLogin);

// log out
router.delete("/logout/:id", refreshTokenController.handleLogout);

// get new access token
router.post("/accesstoken", refreshTokenController.newAccessToken);
module.exports = router;
