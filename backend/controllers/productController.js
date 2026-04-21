const dataStore = require("../models/dataStore");

// GET ALL
exports.getAllProducts = async (req, res) => {
  try {
    const result = await dataStore.listProducts();

    res.json({
      message: "Success get all products",
      products: result
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET BY ID (INI TASK SPRINT 5 KAMU 🔥)
exports.getProductById = async (req, res) => {
  try {
    const productId = Number(req.params.id);

    if (!Number.isInteger(productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await dataStore.getProductById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Success get product detail",
      product
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE
exports.createProduct = async (req, res) => {
  try {
    const id = await dataStore.createProduct(req.body);

    res.status(201).json({
      message: "Produk berhasil dibuat",
      productId: id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
exports.updateProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const success = await dataStore.updateProduct(id, req.body);

    if (!success) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    res.json({ message: "Produk berhasil diupdate" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
exports.deleteProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const success = await dataStore.deleteProduct(id);

    if (!success) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    res.json({ message: "Produk berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD REVIEW
exports.addReview = async (req, res) => {
  try {
    const productId = Number(req.params.id);

    if (!Number.isInteger(productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    // fallback (jika userId tidak ada di token, coba ambil dari body)
    const userId = req.user?.id || req.body.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }

    const result = await dataStore.addReview({
      productId,
      userId,
      review: req.body.review,
      rating: req.body.rating,
    });

    if (result.error) {
      return res.status(result.statusCode || 400).json({
        message: result.error
      });
    }

    res.status(201).json({
      message: "Review berhasil ditambahkan",
      review: result.review,
      product: result.product
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};