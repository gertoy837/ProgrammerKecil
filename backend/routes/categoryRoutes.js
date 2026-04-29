const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const { upload } = require("../config/multer"); 
const { categoryIdParamValidator, createCategoryValidator, updateCategoryValidator } = require("../validator/categoryValidator");

router.get("/", categoryController.getCategories);
router.get("/:id", categoryIdParamValidator, categoryController.getCategoryById); 
router.post("/", authMiddleware, adminMiddleware, upload.single('image'), createCategoryValidator, categoryController.createCategory);
router.put("/:id", authMiddleware, adminMiddleware, upload.single('image'), updateCategoryValidator, categoryController.updateCategory);
router.delete("/:id", authMiddleware, adminMiddleware, categoryIdParamValidator, categoryController.deleteCategory);

module.exports = router;