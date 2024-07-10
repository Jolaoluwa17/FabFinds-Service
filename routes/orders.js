const router = require("express").Router();
const orderController = require("../controllers/orderController");

router.route("/").get(orderController.getAllOrder);

router.route("/:cartId").post(orderController.createOrderFromCart);

router
  .route("/:id")
  .get(orderController.getOrder)
  .delete(orderController.deleteOrder);

router.route("/shipped/:id").put(orderController.shippedOrder);

router.route("/delivered/:id").put(orderController.deliveredOrder);

router.route("/canceled/:id").put(orderController.canceledOrder);

router.route("/user/:id").get(orderController.getOrderByUserId);

module.exports = router;
