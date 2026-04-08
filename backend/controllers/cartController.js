const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.addToCart = async (req, res) => {
  res.json({ message: "Add to cart ready" });
};

exports.getCart = async (req, res) => {
  res.json({ message: "Get cart ready" });
};