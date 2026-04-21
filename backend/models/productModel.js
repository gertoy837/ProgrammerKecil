const { ensureDatabaseReady, getPool } = require("./db");
const {
  executeQuery,
  executeQueryOne,
  executeInsert,
  executeModify,
  getAll,
  getById,
  deleteById,
  exists,
} = require("./queryHelper");

const TABLE = "products";

/**
 * Map database row to product object with normalized data
 * @param {Object} row - Database row
 * @returns {Object} Mapped product object
 */
function mapProductRow(row) {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    stock: row.stock,
    description: row.description,
    image: row.image,
    categoryId: row.categoryId,
    category: row.categoryId
      ? { id: row.categoryId, name: row.categoryName }
      : null,
    averageRating: row.averageRating !== null ? Number(row.averageRating) : null,
    reviewCount: Number(row.reviewCount || 0),
    reviews: [],
  };
}

/**
 * Load all reviews for a specific product
 * @param {number} productId - Product ID
 * @returns {Promise<Array>} Array of review objects
 */
async function loadReviewsForProduct(productId) {
  const sql = `
    SELECT r.id, r.userId, u.name AS userName, r.review, r.rating, r.createdAt
    FROM reviews r
    JOIN users u ON u.id = r.userId
    WHERE r.productId = ?
    ORDER BY r.createdAt DESC, r.id DESC
  `;
  
  const rows = await executeQuery(sql, [productId]);
  
  return rows.map((row) => ({
    id: row.id,
    userId: row.userId,
    userName: row.userName,
    review: row.review,
    rating: row.rating,
    createdAt: row.createdAt,
  }));
}

/**
 * Get product details with aggregated data (JOIN category, count reviews)
 * @param {number} productId - Product ID
 * @returns {Promise<Object|null>} Mapped product with reviews or null
 */
async function getProductById(productId) {
  await ensureDatabaseReady();
  
  const sql = `
    SELECT
      p.id,
      p.name,
      p.price,
      p.stock,
      p.description,
      p.image,
      p.categoryId,
      c.name AS categoryName,
      (SELECT AVG(r.rating) FROM reviews r WHERE r.productId = p.id) AS averageRating,
      (SELECT COUNT(*) FROM reviews r WHERE r.productId = p.id) AS reviewCount
    FROM products p
    LEFT JOIN categories c ON c.id = p.categoryId
    WHERE p.id = ?
    LIMIT 1
  `;
  
  const row = await executeQueryOne(sql, [productId]);
  
  if (!row) {
    return null;
  }

  const product = mapProductRow(row);
  product.reviews = await loadReviewsForProduct(product.id);
  return product;
}

/**
 * List all products with aggregated data
 * @returns {Promise<Array>} Array of mapped products with reviews
 */
async function listProducts() {
  await ensureDatabaseReady();
  
  const sql = `
    SELECT
      p.id,
      p.name,
      p.price,
      p.stock,
      p.description,
      p.image,
      p.categoryId,
      c.name AS categoryName,
      (SELECT AVG(r.rating) FROM reviews r WHERE r.productId = p.id) AS averageRating,
      (SELECT COUNT(*) FROM reviews r WHERE r.productId = p.id) AS reviewCount
    FROM products p
    LEFT JOIN categories c ON c.id = p.categoryId
    ORDER BY p.id ASC
  `;
  
  const rows = await executeQuery(sql);

  return Promise.all(
    rows.map(async (row) => {
      const product = mapProductRow(row);
      product.reviews = await loadReviewsForProduct(product.id);
      return product;
    })
  );
}

/**
 * Create a new product
 * @param {Object} data - Product data { name, price, stock, description, image, categoryId }
 * @returns {Promise<number>} ID of created product
 */
async function createProduct(data) {
  await ensureDatabaseReady();

  const insertId = await executeInsert(
    `INSERT INTO products (name, price, stock, description, image, categoryId)
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

  return insertId;
}

/**
 * Update an existing product
 * @param {number} id - Product ID
 * @param {Object} data - Product data to update { name, price, stock, description, image, categoryId }
 * @returns {Promise<boolean>} True if product was updated
 */
async function updateProduct(id, data) {
  await ensureDatabaseReady();

  return executeModify(
    `UPDATE products 
     SET name = ?, price = ?, stock = ?, description = ?, image = ?, categoryId = ? 
     WHERE id = ?`,
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
}

/**
 * Delete a product
 * @param {number} id - Product ID
 * @returns {Promise<boolean>} True if product was deleted
 */
async function deleteProduct(id) {
  await ensureDatabaseReady();
  return deleteById(TABLE, id);
}

/**
 * Add a review to a product
 * @param {Object} params - Review data { productId, userId, review, rating }
 * @returns {Promise<Object>} Result object with review, product, or error
 */
async function addReview({ productId, userId, review, rating }) {
  await ensureDatabaseReady();
  
  const numericProductId = Number(productId);
  const numericUserId = Number(userId);
  const normalizedRating = Number(rating);

  // Validate IDs are integers
  if (!Number.isInteger(numericProductId) || !Number.isInteger(numericUserId)) {
    return { error: "Valid productId and userId are required", statusCode: 400 };
  }

  // Validate review and rating
  if (!review || !Number.isInteger(normalizedRating) || normalizedRating < 1 || normalizedRating > 5) {
    return { error: "Review and rating 1-5 are required", statusCode: 400 };
  }

  // Check if product exists
  const productExists = await exists(TABLE, numericProductId);
  if (!productExists) {
    return { error: "Product not found", statusCode: 404 };
  }

  // Check if user exists
  const userExists = await exists("users", numericUserId);
  if (!userExists) {
    return { error: "User not found", statusCode: 404 };
  }

  // Insert review
  const reviewId = await executeInsert(
    `INSERT INTO reviews (userId, productId, review, rating) VALUES (?, ?, ?, ?)`,
    [numericUserId, numericProductId, String(review), normalizedRating]
  );

  // Fetch updated product with new review
  const refreshedProduct = await getProductById(numericProductId);

  return {
    review: {
      id: reviewId,
      userId: numericUserId,
      productId: numericProductId,
      review: String(review),
      rating: normalizedRating,
      createdAt: new Date().toISOString(),
    },
    product: refreshedProduct,
  };
}

module.exports = {
  addReview,
  getProductById,
  listProducts,
  mapProductRow,
  createProduct,
  updateProduct,
  deleteProduct,
  loadReviewsForProduct,
};
