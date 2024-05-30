const router = require("express").Router();
const forgotPasswordController = require("../controllers/forgotPasswordController");

router.route("/send-otp").post(forgotPasswordController.sendOtp);

router.post('/verify-otp', forgotPasswordController.verifyOtp);


module.exports = router;
