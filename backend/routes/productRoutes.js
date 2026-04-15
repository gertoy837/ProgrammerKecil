const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const { productIdParamValidator, reviewValidator } = require("../validator/productValidator");


router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

router.get("/", productController.getAllProducts);
router.get("/:id", productIdParamValidator, productController.getProductById);

router.post("/:id/reviews", reviewValidator, productController.addReview);

module.exports = router;