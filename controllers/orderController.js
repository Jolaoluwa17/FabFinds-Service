const Cart = require("../models/Cart");
const Order = require("../models/Order");

// GET all orders
const getAllOrder = async (req, res) => {
  try {
    const orders = await Order.find();
    if (orders.length === 0) {
      return res.status(404).json({ message: "no orders found" });
    }
    return res.status(200), json(orders);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// CREATE new orders
const createNewOrder = async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    return res.status(200).json(savedOrder);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

const createOrderFromCart = async (req, res) => {
  const { cartId } = req.params;
  const { shippingAddress } = req.body; // Assuming shippingAddress is passed in the request body

  try {
    // Find the cart by ID
    const cart = await Cart.findById(cartId).populate("items");

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Calculate the total price
    const totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    // Create a new order
    const newOrder = new Order({
      user: cart.user,
      items: cart.items,
      totalPrice,
      shippingAddress,
      orderDate: new Date(),
      status: "Pending",
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    // Clear the items array in the cart
    cart.items = [];
    await cart.save();

    res.status(201).json(savedOrder); // Respond with the created order
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// GET specific order
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "order not found" });
    }
    return res.status(200).json(order);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// GET order by user id
const getOrderByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const orders = await Order.find({ user: userId })
      .populate({
        path: "items",
        populate: {
          path: "product",
          select: "name",
        },
      })
      .populate({
        path: "items",
        populate: {
          path: "size",
          select: "suffix",
        },
      })
      .populate({
        path: "items",
        populate: {
          path: "color",
          select: "name",
        },
      });
    return res.status(200).json(orders);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const shippedOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "Shipped" },
      { new: true },
    );
    return res.status(200).json(updatedOrder);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const deliveredOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "Delivered" },
      { new: true },
    );
    return res.status(200).json(updatedOrder);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const canceledOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "Canceled" },
      { new: true },
    );
    return res.status(200).json(updatedOrder);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// DELETE order
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "order not found" });
    }
    await Review.deleteOne({ _id: req.params.id });
    return res.status(200).json("order has been deleted...");
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  getAllOrder,
  getOrder,
  getOrderByUserId,
  createNewOrder,
  deleteOrder,
  shippedOrder,
  deliveredOrder,
  canceledOrder,
  createOrderFromCart,
};
