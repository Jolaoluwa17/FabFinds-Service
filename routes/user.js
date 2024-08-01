const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyJWT = require("../middlewares/verifyJWT");
const ROLES_LIST = require("../config/roles_list");
const verifyRoles = require("../middlewares/verifyRoles");

router
  .route("/")
  .get(verifyJWT, verifyRoles(ROLES_LIST.Admin), userController.getAllUsers);

router.route("/me").get(verifyJWT, userController.getLoggedInUser);

router.route("/send-verify-email").post(userController.sendVerifyEmail);

router.route("/verify-account").post(userController.verifyEmail);

router
  .route("/:id")
  .get(verifyJWT, verifyRoles(ROLES_LIST.User), userController.getUser)
  .put(verifyJWT, verifyRoles(ROLES_LIST.Admin), userController.updateUser)
  .delete(verifyJWT, verifyRoles(ROLES_LIST.Admin), userController.deleteUser);

module.exports = router;
