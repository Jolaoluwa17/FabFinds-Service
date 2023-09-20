const router = require("express").Router();
const forgotPasswordController = require("../controllers/forgotPasswordController");

router.route("/").post(forgotPasswordController.sendOtp);

module.exports = router;
