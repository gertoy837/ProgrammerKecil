const dataStore = require("../models/dataStore");

exports.getAllProducts = async (req, res) => {
  const result = await dataStore.listProducts();
  res.json({ products: result });
};

exports.getProductById = async (req, res) => {
  const productId = Number(req.params.id);

  if (!Number.isInteger(productId)) {
    return res.status(400).json({ message: "Invalid product id" });
  }

  const product = await dataStore.getProductById(productId);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json({ product });
};

exports.addReview = async (req, res) => {
  const productId = Number(req.params.id);

  if (!Number.isInteger(productId)) {
    return res.status(400).json({ message: "Invalid product id" });
  }

  const result = await dataStore.addReview({
    productId,
    userId: req.body.userId,
    review: req.body.review,
    rating: req.body.rating,
  });

  if (result.error) {
    return res.status(result.statusCode || 400).json({ message: result.error });
  }

  res.status(201).json({ review: result.review, product: result.product });
};