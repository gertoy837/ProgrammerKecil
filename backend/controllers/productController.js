const dataStore = require("../models/dataStore");

// GET ALL
exports.getAllProducts = async (req, res) => {
  try {
    const result = await dataStore.listProducts();
    res.json({ products: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET BY ID
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

    res.json({ product });
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

    const result = await dataStore.addReview({
      productId,
      userId: req.user.id,
      review: req.body.review,
      rating: req.body.rating,
    });

    if (result.error) {
      return res.status(result.statusCode || 400).json({ message: result.error });
    }

    res.status(201).json({ review: result.review, product: result.product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};