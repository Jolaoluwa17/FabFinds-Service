const router = require("express").Router();
const otpController = require("../controllers/otpController");

router.route("/").get(otpController.getAllOtps);

router.route("/:id").get(otpController.getOtpUserId);

module.exports = router;
