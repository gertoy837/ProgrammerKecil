const db = require("../lib/db");
const { ensureDatabaseReady } = require("./db");
const { authenticateUser, registerUser, toPublicUser } = require("./userModel");
const { listProducts, getProductById, addReview } = require("./productModel");
const { getCartForUser, addToCart } = require("./cartModel");


//CREATE, UPDATE, DELETE PRODUCT
const createProduct = async (data) => {
  const [result] = await db.query(
    `INSERT INTO product (name, price, stock, description, image, categoryId)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      data.name,
      data.price,
      data.stock,
      data.description,
      data.image,
      data.categoryId,
    ]
  );

  return result.insertId;
};

const updateProduct = async (id, data) => {
  const [result] = await db.query(
    `UPDATE product 
     SET name=?, price=?, stock=?, description=?, image=?, categoryId=? 
     WHERE id=?`,
    [
      data.name,
      data.price,
      data.stock,
      data.description,
      data.image,
      data.categoryId,
      id
    ]
  );

  return result.affectedRows > 0;
};

const deleteProduct = async (id) => {
  const [result] = await db.query(
    "DELETE FROM product WHERE id=?",
    [id]
  );

  return result.affectedRows > 0;
};

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

  createProduct,
  updateProduct,
  deleteProduct
};
