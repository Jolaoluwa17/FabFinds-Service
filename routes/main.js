const AuthRouter = require("./auth");
const UserRouter = require("./user");
const ProductRouter = require("./product");
const ProductImgRouter = require("./productImg");
const ReviewRouter = require("./review");
const OrderRouter = require("./orders");
const CollectionRouter = require("./collection");
const CategoryRouter = require("./category");

const routes = ({ app }) => {
  app.use("/auth", AuthRouter);
  app.use("/user", UserRouter);
  app.use("/product", ProductRouter);
  app.use("/productImg", ProductImgRouter);
  app.use("/review", ReviewRouter);
  app.use("/order", OrderRouter);
  app.use("/collection", CollectionRouter);
  app.use("/category", CategoryRouter);
};

module.exports = { routes };
