const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.getAllProducts = async (req, res) => {
  res.json({ message: "Get all products ready" });
};

exports.getProductById = async (req, res) => {
  res.json({ message: "Get product detail ready" });
};