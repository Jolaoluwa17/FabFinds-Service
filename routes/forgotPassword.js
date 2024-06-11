const router = require("express").Router();
const forgotPasswordController = require("../controllers/forgotPasswordController");

router.route("/send-otp").post(forgotPasswordController.sendOtp);

router.route("/verify-otp").post(forgotPasswordController.verifyOtp);

module.exports = router;
