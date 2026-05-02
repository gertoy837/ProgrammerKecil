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
  return deleteById(TABLE, id);
}

module.exports = {
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};