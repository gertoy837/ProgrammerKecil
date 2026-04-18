const dataStore = require("../models/dataStore");

exports.addToCart = async (req, res) => {
  const result = await dataStore.addToCart(req.body);

  if (result.error) {
    return res.status(result.statusCode || 400).json({ message: result.error });
  }

  res.status(201).json(result);
};

exports.getCart = async (req, res) => {
  const userId = Number(req.params.userId);

  if (!Number.isInteger(userId)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  const result = await dataStore.getCartForUser(userId);

  if (result.error) {
    return res.status(result.statusCode || 400).json({ message: result.error });
  }

  res.json(result);
};

exports.updateQuantity = async (req, res) => {
  const { cartItemId, quantity } = req.body;
  const result = await dataStore.updateQuantity(cartItemId, quantity);
  if (result.error) {
    return res.status(result.statusCode || 400).json({ message: result.error });
  }
  res.json({ message: "Quantity updated successfully" });
};

exports.deleteItem = async (req, res) => {
  const result = await dataStore.deleteItem(req.params.id);
  if (result.error) {
    return res.status(result.statusCode || 400).json({ message: result.error });
  }
  res.json({ message: "Item deleted successfully" });
};

exports.clearCart = async (req, res) => {
  const result = await dataStore.clearCart(req.params.userId);
  if (result.error) {
    return res.status(result.statusCode || 400).json({ message: result.error });
  }
  res.json({ message: "Cart cleared successfully" });
};