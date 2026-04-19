const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");
const {
	addToCartValidator,
	userIdParamValidator,
	cartItemIdParamValidator,
	updateQuantityValidator,
} = require("../validator/cartValidator");

router.use(authMiddleware);

router.post("/", addToCartValidator, cartController.addToCart);
router.get("/me", cartController.getMyCart);
router.get("/:userId", userIdParamValidator, cartController.getCart);
router.put("/update", updateQuantityValidator, cartController.updateQuantity);
router.delete("/item/:id", cartItemIdParamValidator, cartController.deleteItem);
router.delete("/clear", cartController.clearMyCart);
router.delete("/clear/:userId", userIdParamValidator, cartController.clearCart);

module.exports = router;