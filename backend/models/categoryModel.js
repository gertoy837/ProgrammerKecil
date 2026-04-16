const { getPool } = require("./db");

// GET ALL
async function listCategories() {
  const pool = getPool();
  const [rows] = await pool.query("SELECT * FROM category");
  return rows;
}

// GET BY ID 🔥
async function getCategoryById(id) {
  const pool = getPool();
  const [rows] = await pool.query(
    "SELECT * FROM category WHERE id = ?",
    [id]
  );
  return rows[0] || null;
}

// CREATE
async function createCategory(name) {
  const pool = getPool();
  const [result] = await pool.query(
    "INSERT INTO category (name) VALUES (?)",
    [name]
  );
  return result.insertId;
}

// UPDATE
async function updateCategory(id, name) {
  const pool = getPool();
  const [result] = await pool.query(
    "UPDATE category SET name=? WHERE id=?",
    [name, id]
  );
  return result.affectedRows > 0;
}

// DELETE
async function deleteCategory(id) {
  const pool = getPool();
  const [result] = await pool.query(
    "DELETE FROM category WHERE id=?",
    [id]
  );
  return result.affectedRows > 0;
}

module.exports = {
  listCategories,
  getCategoryById, 
  createCategory,
  updateCategory,
  deleteCategory
};