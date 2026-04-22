const { ensureDatabaseReady } = require("../lib/db");
const {
  authenticateUser,
  registerUser,
  toPublicUser,
  getUserProfile,
  updateUserProfile,
} = require("./userModel");
const {
  getCartForUser,
  addToCart,
  updateQuantity,
  updateQuantityForUser,
  deleteItem,
  deleteItemForUser,
  clearCart,
} = require("./cartModel");

const {
  listProducts,
  getProductById,
  addReview,
  createProduct,
  updateProduct,
  deleteProduct
} = require("./productModel");

const {
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require("./categoryModel");


module.exports = {
  addReview,  
  addToCart,
  authenticateUser,
  ensureDatabaseReady,
  getCartForUser,
  getProductById,
  listProducts,
  registerUser,
  toPublicUser,
  getUserProfile,
  updateUserProfile,
  createProduct,
  updateProduct,
  deleteProduct,
  listCategories,
  createCategory,
  updateCategory,
  getCategoryById,
  deleteCategory,
  updateQuantity,
  updateQuantityForUser,
  deleteItem,
  deleteItemForUser,
  clearCart
};