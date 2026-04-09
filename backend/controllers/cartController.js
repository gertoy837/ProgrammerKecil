const prisma = require("../lib/prisma");

exports.addToCart = async (req, res) => {
  res.json({ message: "Add to cart ready" });
};

exports.getCart = async (req, res) => {
  res.json({ message: "Get cart ready" });
};