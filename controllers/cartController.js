const Cart = require("../models/Cart");
const Item = require("../models/Item");

const createItem = async (product, quantity, price, size, color) => {
  try {
    // Create a new Item instance
    const newItem = new Item({
      product,
      quantity,
      price,
      size,
      color,
    });

    // Save the item to the database
    const savedItem = await newItem.save();
    return savedItem; // Return the created item object
  } catch (error) {
    throw new Error("Error creating item:", error.message);
  }
};

const addItemToCart = async (req, res) => {
  const { user } = req.body;
  const { product, quantity, price, size, color } = req.body;

  try {
    // Create the item using the createItem function
    const createdItem = await createItem(product, quantity, price, size, color);

    // Retrieve the ID of the created item
    const itemId = createdItem._id;

    // Find the user's cart or create a new one if it doesn't exist
    let cart = await Cart.findOne({ user });

    if (!cart) {
      // Create a new cart if it doesn't exist
      cart = new Cart({
        user,
        items: [],
      });
    }

    // Add the item ID to the cart's items array
    cart.items.push(itemId);

    // Save the updated cart
    const updatedCart = await cart.save();

    res.status(200).json(updatedCart); // Respond with the updated cart
  } catch (error) {
    res.status(500).json({ error: "Server error" }); // Handle server error
  }
};

const getItemsInCart = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ user: id })
      .populate({
        path: "items",
        populate: {
          path: "product",
          select: "name productImg",
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

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Respond with the items in the cart
    res.status(200).json(cart.items);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const editItem = async (req, res) => {
  const { id } = req.params;
  const { product, quantity, price, size, color } = req.body;

  try {
    // Find the item by ID and update it with the new details
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { product, quantity, price, size, color },
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );

    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json(updatedItem); // Respond with the updated item
  } catch (error) {
    console.error("Error updating item:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the item to be deleted from items collection
    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Delete the item from items collection
    await Item.deleteOne({ _id: item });

    // Remove the item ID from carts that reference it
    await Cart.updateMany({}, { $pull: { items: id } });

    res.status(200).json({ message: "Item removed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  addItemToCart,
  getItemsInCart,
  editItem,
  deleteItem,
};
