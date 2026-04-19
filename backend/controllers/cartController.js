const dataStore = require("../models/dataStore");

exports.addToCart = async (req, res) => {
  const result = await dataStore.addToCart({
    userId: req.user.id,
    productId: req.body.productId,
    quantity: req.body.quantity,
  });

  if (result.error) {
    return res.status(result.statusCode || 400).json({ message: result.error });
  }

  res.status(201).json(result);
};

exports.getMyCart = async (req, res) => {
  const result = await dataStore.getCartForUser(req.user.id);

  if (result.error) {
    return res.status(result.statusCode || 400).json({ message: result.error });
  }

  res.json(result);
};

exports.getCart = async (req, res) => {
  const userId = Number(req.params.userId);

  if (!Number.isInteger(userId)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  if (req.user.role !== "admin" && req.user.id !== userId) {
    return res.status(403).json({ message: "Access denied" });
  }

  const result = await dataStore.getCartForUser(userId);

  if (result.error) {
    return res.status(result.statusCode || 400).json({ message: result.error });
  }

  res.json(result);
};

exports.updateQuantity = async (req, res) => {
  const { cartItemId, quantity } = req.body;
  const result = await dataStore.updateQuantityForUser(req.user.id, cartItemId, quantity);
  if (result.error) {
    return res.status(result.statusCode || 400).json({ message: result.error });
  }

  if (!result.affectedRows) {
    return res.status(404).json({ message: "Cart item not found" });
  }

  res.json({ message: "Quantity updated successfully" });
};

exports.deleteItem = async (req, res) => {
  const result = await dataStore.deleteItemForUser(req.user.id, req.params.id);
  if (result.error) {
    return res.status(result.statusCode || 400).json({ message: result.error });
  }

  if (!result.affectedRows) {
    return res.status(404).json({ message: "Cart item not found" });
  }

  res.json({ message: "Item deleted successfully" });
};

exports.clearMyCart = async (req, res) => {
  const result = await dataStore.clearCart(req.user.id);
  if (result.error) {
    return res.status(result.statusCode || 400).json({ message: result.error });
  }
  res.json({ message: "Cart cleared successfully" });
};

exports.clearCart = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  const result = await dataStore.clearCart(req.params.userId);
  if (result.error) {
    return res.status(result.statusCode || 400).json({ message: result.error });
  }
  res.json({ message: "Cart cleared successfully" });
};