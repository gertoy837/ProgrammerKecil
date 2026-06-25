const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.use(authMiddleware);

router.post("/checkout", orderController.checkout);
router.get("/all", adminMiddleware, orderController.getAllOrders);

module.exports = router;
