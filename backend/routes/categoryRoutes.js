const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const { upload } = require("../config/multer");
const {
	handleFileUploadError,
	validateFilePresence,
	validateFilePresenceOptional,
} = require("../middleware/fileValidation");
const {
	categoryIdParamValidator,
	createCategoryValidator,
	updateCategoryValidator,
} = require("../validator/categoryValidator");

router.get("/", categoryController.getCategories);
router.get("/:id", categoryIdParamValidator, categoryController.getCategoryById);
router.post(
	"/",
	authMiddleware,
	adminMiddleware,
	upload.single("image"),
	handleFileUploadError,
	validateFilePresence,
	createCategoryValidator,
	categoryController.createCategory
);
router.put(
	"/:id",
	authMiddleware,
	adminMiddleware,
	upload.single("image"),
	handleFileUploadError,
	categoryIdParamValidator,
	validateFilePresenceOptional,
	updateCategoryValidator,
	categoryController.updateCategory
);
router.delete("/:id", authMiddleware, adminMiddleware, categoryIdParamValidator, categoryController.deleteCategory);

module.exports = router;