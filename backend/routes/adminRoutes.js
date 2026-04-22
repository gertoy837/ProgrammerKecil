const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
	adminLoginValidator,
	adminUpdateValidator,
	requireAdminUpdatePayload,
} = require("../validator/adminValidator");

router.post("/login", adminLoginValidator, adminController.login);

router.get("/me", authMiddleware, adminMiddleware, adminController.getCurrentAdmin);
router.put("/update", authMiddleware, adminMiddleware, adminUpdateValidator, requireAdminUpdatePayload, adminController.updateProfile);
router.post("/logout", authMiddleware, adminMiddleware, adminController.logout);

module.exports = router;