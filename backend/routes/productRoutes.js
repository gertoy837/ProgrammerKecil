const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const { productIdParamValidator, reviewValidator } = require("../validator/productValidator");

router.get("/products", productController.getAllProducts);
router.get("/products/:id", productIdParamValidator, productController.getProductById);
router.post("/products/:id/reviews", reviewValidator, productController.addReview);

module.exports = router;