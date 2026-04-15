const dataStore = require("../lib/dataStore");

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