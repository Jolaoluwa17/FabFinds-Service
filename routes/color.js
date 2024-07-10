const express = require("express");
const router = express.Router();
const colorController = require("../controllers/colorController");
const verifyJWT = require("../middlewares/verifyJWT");
const ROLES_LIST = require("../config/roles_list");
const verifyRoles = require("../middlewares/verifyRoles");

router
  .route("/")
  .post(colorController.createColor)
  .get(colorController.getAllColors);

router
  .route("/:id")
  .get(colorController.getColorById)
  .put(colorController.updateColor)
  .delete(colorController.deleteColor);

module.exports = router;
