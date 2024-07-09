const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// signup for user
router.post("/user/signup", authController.handleNewUser);

// sign up for admin
router.post("/admin/signup", authController.handleNewAdmin);

// Sign in with email and password for user
router.post("/user/login", authController.handleUserLogin);

// Login with email and password for admin
router.post("/admin/login", authController.handleAdminLogin);

// Get new refresh token
router.get("/refreshToken", authController.handleRefreshToken);

// logout
router.get("/logout", authController.handleLogout);

module.exports = router;
