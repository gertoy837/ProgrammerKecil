const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { registerValidator, loginValidator, updateProfileValidator } = require("../validator/authValidator");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", registerValidator, authController.register);
router.post("/login", loginValidator, authController.login);
router.get("/me", authMiddleware, authController.me);
router.put("/updateProfile", authMiddleware, ...updateProfileValidator, authController.updateProfile);
router.post("/logout", authMiddleware, authController.logout);

module.exports = router;