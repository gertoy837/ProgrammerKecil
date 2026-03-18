const express = require("express");
const router = express.Router();

// 🔥 WAJIB ADA INI
const productController = require("../controllers/productController");

router.get("/", (req, res) => {
  res.send("API Ready");
});

// routes product
router.get("/products", productController.getAllProducts);
router.get("/products/:id", productController.getProductById);

module.exports = router;