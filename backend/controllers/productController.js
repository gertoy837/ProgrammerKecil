const prisma = require("../lib/prisma");

exports.getAllProducts = async (req, res) => {
  res.json({ message: "Get all products ready" });
};

exports.getProductById = async (req, res) => {
  res.json({ message: "Get product detail ready" });
};

exports.addReview = async (req, res) => {
  res.json({ message: "Review endpoint ready" });
};