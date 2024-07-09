const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// User routes
const userRouter = express.Router();
userRouter.post("/signup", authController.handleNewUser);
userRouter.post("/login", authController.handleUserLogin);

// Admin routes
const adminRouter = express.Router();
adminRouter.post("/signup", authController.handleNewAdmin);
adminRouter.post("/login", authController.handleAdminLogin);

// Common auth routes
router.get("/refreshToken", authController.handleRefreshToken);
router.get("/logout", authController.handleLogout);

// OTP routes
router.post("/forgot-password/send-otp", authController.sendOtp);
router.post("/forgot-password/verify-otp", authController.verifyOtp);

// Use the user and admin routers
router.use("/user", userRouter);
router.use("/admin", adminRouter);

module.exports = router;
