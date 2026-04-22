const { ensureDatabaseReady } = require("../lib/db");
const {
  executeQuery,
  executeQueryOne,
  executeInsert,
  executeModify,
  getAll,
  getById,
  deleteById,
} = require("./queryHelper");

const TABLE = "categories";

/**
 * Get all categories ordered by ID
 * @returns {Promise<Array>} List of category objects
 */
async function listCategories() {
  await ensureDatabaseReady();
  return getAll(TABLE, { orderBy: "id ASC" });
}

/**
 * Get category by ID
 * @param {number} id - Category ID
 * @returns {Promise<Object|null>} Category object or null if not found
 */
async function getCategoryById(id) {
  await ensureDatabaseReady();
  return getById(TABLE, id);
}

/**
 * Create a new category
 * @param {string} name - Category name
 * @returns {Promise<number>} ID of created category
 */
async function createCategory(name) {
  await ensureDatabaseReady();
  return executeInsert(
    "INSERT INTO categories (name) VALUES (?)",
    [name]
  );
}

/**
 * Update a category
 * @param {number} id - Category ID
 * @param {string} name - New category name
 * @returns {Promise<boolean>} True if category was updated
 */
async function updateCategory(id, name) {
  await ensureDatabaseReady();
  return executeModify(
    "UPDATE categories SET name = ? WHERE id = ?",
    [name, id]
  );
}

/**
 * Delete a category
 * @param {number} id - Category ID
 * @returns {Promise<boolean>} True if category was deleted
 */
async function deleteCategory(id) {
  await ensureDatabaseReady();
  return deleteById(TABLE, id);
}

module.exports = {
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};