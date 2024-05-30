const router = require("express").Router();
const orderController = require("../controllers/orderController");

router
  .route("/")
  .post(orderController.createNewOrder)
  .get(orderController.getAllOrder);

router
  .route("/:id")
  .get(orderController.getOrder)
  .put(orderController.updateOrder)
  .delete(orderController.deleteOrder);

router.route("/shipped/:id").put(orderController.shippedOrder);

router.route("/delivered/:id").put(orderController.deliveredOrder);

router.route("/canceled/:id").put(orderController.canceledOrder);

router.route("/user/:id").get(orderController.getOrderByUserId);

module.exports = router;
