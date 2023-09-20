const router = require("express").Router();
const productController = require("../controllers/productController");

router
  .route("/")
  .post(productController.createNewProduct)
  .get(productController.getAllProducts);

router
  .route("/:id")
  .get(productController.getProduct)
  .put(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
