const { getPool } = require("../lib/db");

/**
 * Execute a SELECT query with parameters
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Array>} Result rows
 */
async function executeQuery(sql, params = []) {
  const pool = getPool();
  const [rows] = await pool.query(sql, params);
  return rows;
}

/**
 * Execute a single row SELECT query (returns first row or null)
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Object|null>} First row or null
 */
async function executeQueryOne(sql, params = []) {
  const rows = await executeQuery(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Execute an INSERT query
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<number>} Insert ID
 */
async function executeInsert(sql, params = []) {
  const pool = getPool();
  const [result] = await pool.query(sql, params);
  return result.insertId;
}

/**
 * Execute an UPDATE or DELETE query
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<boolean>} True if rows were affected
 */
async function executeModify(sql, params = []) {
  const pool = getPool();
  const [result] = await pool.query(sql, params);
  return result.affectedRows > 0;
}

/**
 * Execute a COUNT query
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<number>} Count result
 */
async function executeCount(sql, params = []) {
  const rows = await executeQuery(sql, params);
  return rows.length > 0 ? Number(rows[0].count || 0) : 0;
}

/**
 * Get record by ID from table
 * @param {string} table - Table name
 * @param {number|string} id - Record ID
 * @returns {Promise<Object|null>}
 */
async function getById(table, id) {
  return executeQueryOne(
    `SELECT * FROM ${table} WHERE id = ? LIMIT 1`,
    [id]
  );
}

/**
 * Get all records from table
 * @param {string} table - Table name
 * @param {Object} options - Query options { orderBy, limit }
 * @returns {Promise<Array>}
 */
async function getAll(table, options = {}) {
  let sql = `SELECT * FROM ${table}`;
  
  if (options.orderBy) {
    sql += ` ORDER BY ${options.orderBy}`;
  } else {
    sql += ` ORDER BY id ASC`;
  }
  
  if (options.limit) {
    sql += ` LIMIT ${options.limit}`;
  }
  
  return executeQuery(sql);
}

/**
 * Delete record from table
 * @param {string} table - Table name
 * @param {number|string} id - Record ID
 * @returns {Promise<boolean>}
 */
async function deleteById(table, id) {
  return executeModify(
    `DELETE FROM ${table} WHERE id = ?`,
    [id]
  );
}

/**
 * Check if record exists
 * @param {string} table - Table name
 * @param {number|string} id - Record ID
 * @returns {Promise<boolean>}
 */
async function exists(table, id) {
  const row = await executeQueryOne(
    `SELECT id FROM ${table} WHERE id = ? LIMIT 1`,
    [id]
  );
  return row !== null;
}

module.exports = {
  executeQuery,
  executeQueryOne,
  executeInsert,
  executeModify,
  executeCount,
  getById,
  getAll,
  deleteById,
  exists
};
