const express = require("express");

const authRoutes = require("./authRoutes");
const adminRoutes = require("./adminRoutes");
const productRoutes = require("./productRoutes");
const cartRoutes = require("./cartRoutes");
const categoryRoutes = require("./categoryRoutes");
const orderRoutes = require("./orderRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/categories", categoryRoutes);
router.use("/orders", orderRoutes);

module.exports = router;