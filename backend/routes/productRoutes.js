const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  productIdParamValidator,
  createProductValidator,
  updateProductValidator,
  reviewValidator
} = require("../validator/productValidator");

// =======================
// PUBLIC ROUTES
// =======================

// GET ALL PRODUCTS
router.get("/", productController.getAllProducts);

// GET PRODUCT DETAIL
router.get("/:id", productIdParamValidator, productController.getProductById);

// =======================
// REVIEW ROUTES
// =======================

// ADD REVIEW
router.post(
  "/:id/reviews",
  authMiddleware,
  reviewValidator,
  productController.addReview
);

// =======================
// ADMIN ROUTES
// =======================

// CREATE PRODUCT
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createProductValidator,
  productController.createProduct
);

// UPDATE PRODUCT
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  productIdParamValidator,
  updateProductValidator,
  productController.updateProduct
);

// DELETE PRODUCT
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  productIdParamValidator,
  productController.deleteProduct
);

module.exports = router;