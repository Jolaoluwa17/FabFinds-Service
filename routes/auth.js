const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController");
const authController = require("../controllers/authController");

// create a new user
router.post("/user/signup", registerController.handleNewUser);

// create a new admin
router.post("/admin/signup", registerController.handleNewAdmin);

// Sign in with email/username and password for user
router.post("/user/login", authController.handleUserLogin);

// Login with email/username and password for admin
router.post("/admin/login", authController.handleAdminLogin);

module.exports = router;
