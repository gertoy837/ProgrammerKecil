const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");
const { addToCartValidator, userIdParamValidator } = require("../validator/cartValidator");

router.post("/cart", addToCartValidator, cartController.addToCart);
router.get("/cart/:userId", userIdParamValidator, cartController.getCart);

module.exports = router;