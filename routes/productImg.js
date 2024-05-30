const router = require("express").Router();
const productImgController = require("../controllers/productImgController");

router.route("/:id").delete(productImgController.deleteImageById);

module.exports = router;
