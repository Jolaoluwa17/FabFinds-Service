const AuthRouter = require("./auth");
const UserRouter = require("./user");
const ProductRouter = require("./product");
const ProductImgRouter = require("./productImg");
const ReviewRouter = require("./review");
const OrderRouter = require("./orders");
const CollectionRouter = require("./collection");
const ForgotPasswordRouter = require("./forgotPassword");
const CategoryRouter = require("./category");
const OtpRouter = require("./otp");
const RefreshRouter = require("./refresh");
const LogoutRouter = require("./logout");

const routes = ({ app }) => {
  app.use("/", AuthRouter);
  app.use("/refresh", RefreshRouter);
  app.use("/logout", LogoutRouter);
  app.use("/user", UserRouter);
  app.use("/product", ProductRouter);
  app.use("/productImg", ProductImgRouter);
  app.use("/review", ReviewRouter);
  app.use("/order", OrderRouter);
  app.use("/collection", CollectionRouter);
  app.use("/category", CategoryRouter);
  app.use("/forgotpassword", ForgotPasswordRouter);
  app.use("/otp", OtpRouter);
};

module.exports = { routes };
