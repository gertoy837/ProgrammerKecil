const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");
const { addToCartValidator, userIdParamValidator } = require("../validator/cartValidator");

router.post("/", addToCartValidator, cartController.addToCart);
router.get("/:userId", userIdParamValidator, cartController.getCart);

module.exports = router;