const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ✅ ambil semua product + category
exports.getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true
      }
    });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error ambil product" });
  }
};

// ✅ ambil product by id + category
exports.getProductById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true
      }
    });

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error ambil product by id" });
  }
};