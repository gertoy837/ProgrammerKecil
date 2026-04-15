const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { registerValidator, loginValidator } = require("../validator/authValidator");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", registerValidator, authController.register);
router.post("/login", loginValidator, authController.login);
router.get("/auth/me", authMiddleware, authController.me);

module.exports = router;