const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const verifyJWT = require("../middlewares/verifyJWT");
const ROLES_LIST = require("../config/roles_list");
const verifyRoles = require("../middlewares/verifyRoles");

router
  .route("/")
  .post(
    /*verifyJWT, verifyRoles(ROLES_LIST.User),*/ cartController.addItemToCart
  );

router
  .route("/:id")
  .get(
    /*verifyJWT, verifyRoles(ROLES_LIST.User),*/ cartController.getItemsInCart
  )
  .put(/*verifyJWT, verifyRoles(ROLES_LIST.User),*/ cartController.editItem)
  .delete(
    /*verifyJWT, verifyRoles(ROLES_LIST.User),*/ cartController.deleteItem
  );

module.exports = router;
