const { ensureDatabaseReady, getPool } = require("../lib/db");

// Local query helpers (replaces ./queryHelper usage)
async function executeQuery(sql, params = []) {
  const pool = getPool();
  const [rows] = await pool.query(sql, params);
  return rows;
}

async function executeQueryOne(sql, params = []) {
  const rows = await executeQuery(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

async function executeInsert(sql, params = []) {
  const pool = getPool();
  const [result] = await pool.query(sql, params);
  return result.insertId;
}

async function executeModify(sql, params = []) {
  const pool = getPool();
  const [result] = await pool.query(sql, params);
  return result.affectedRows > 0;
}

const TABLE = "categories";

/**
 * Get all categories ordered by ID
 * @returns {Promise<Array>} List of category objects
 */
async function listCategories() {
  await ensureDatabaseReady();
  const sql = `SELECT id, name, image FROM ${TABLE} ORDER BY id ASC`;
  return executeQuery(sql);
}

/**
 * Get category by ID
 * @param {number} id - Category ID
 * @returns {Promise<Object|null>} Category object or null if not found
 */
async function getCategoryById(id) {
  await ensureDatabaseReady();
  return executeQueryOne(`SELECT * FROM ${TABLE} WHERE id = ? LIMIT 1`, [id]);
}

/**
 * Create a new category
 * @param {string} name - Category name
 * @param {string} image - Category image filename
 * @returns {Promise<number>} ID of created category
 */
async function createCategory(name, image) {
  await ensureDatabaseReady();
  return executeInsert(
    "INSERT INTO categories (name, image) VALUES (?, ?)",
    [name, image]
  );
}

/**
 * Update a category
 * @param {number} id - Category ID
 * @param {string} name - New category name
 * @param {string} image - New category image filename
 * @returns {Promise<boolean>} True if category was updated
 */
async function updateCategory(id, name, image) {
  await ensureDatabaseReady();

  const updates = [];
  const values = [];

  if (name !== undefined) {
    updates.push("name = ?");
    values.push(name);
  }

  if (image !== undefined) {
    updates.push("image = ?");
    values.push(image);
  }

  if (updates.length === 0) {
    return false;
  }

  return executeModify(
    `UPDATE categories SET ${updates.join(", ")} WHERE id = ?`,
    [...values, id]
  );
}

/**
 * Delete a category
 * @param {number} id - Category ID
 * @returns {Promise<boolean>} True if category was deleted
 */
async function deleteCategory(id) {
  await ensureDatabaseReady();
  return executeModify(`DELETE FROM ${TABLE} WHERE id = ?`, [id]);
}

module.exports = {
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};