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
  checkoutCart,
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

const {
  getAllOrders
} = require("./orderModel");

module.exports = {
  addReview,  
  addToCart,
  authenticateUser,
  registerUser,
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
  clearCart,
  checkoutCart,
  getAllOrders
};