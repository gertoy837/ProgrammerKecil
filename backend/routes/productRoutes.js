const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const { productIdParamValidator, createProductValidator, updateProductValidator, reviewValidator } = require("../validator/productValidator");


router.post("/", authMiddleware, adminMiddleware, createProductValidator, productController.createProduct);
router.put("/:id", authMiddleware, adminMiddleware, updateProductValidator, productController.updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, productIdParamValidator, productController.deleteProduct);

router.get("/", productController.getAllProducts);
router.get("/:id", productIdParamValidator, productController.getProductById);

router.post("/:id/reviews", reviewValidator, productController.addReview);

module.exports = router;