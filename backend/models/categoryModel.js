const { ensureDatabaseReady, getPool } = require("./db");

// GET ALL
async function listCategories() {
  await ensureDatabaseReady();
  const pool = getPool();
  const [rows] = await pool.query("SELECT * FROM categories");
  return rows;
}

// GET BY ID 🔥
async function getCategoryById(id) {
  await ensureDatabaseReady();
  const pool = getPool();
  const [rows] = await pool.query(
    "SELECT * FROM categories WHERE id = ?",
    [id]
  );
  return rows[0] || null;
}

// CREATE
async function createCategory(name) {
  await ensureDatabaseReady();
  const pool = getPool();
  const [result] = await pool.query(
    "INSERT INTO categories (name) VALUES (?)",
    [name]
  );
  return result.insertId;
}

// UPDATE
async function updateCategory(id, name) {
  await ensureDatabaseReady();
  const pool = getPool();
  const [result] = await pool.query(
    "UPDATE categories SET name=? WHERE id=?",
    [name, id]
  );
  return result.affectedRows > 0;
}

// DELETE
async function deleteCategory(id) {
  await ensureDatabaseReady();
  const pool = getPool();
  const [result] = await pool.query(
    "DELETE FROM categories WHERE id=?",
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