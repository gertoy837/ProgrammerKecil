const { ensureDatabaseReady, getPool } = require("./db");

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

async function loadReviewsForProduct(productId) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT r.id, r.userId, u.name AS userName, r.review, r.rating, r.createdAt
     FROM reviews r
     JOIN users u ON u.id = r.userId
     WHERE r.productId = ?
     ORDER BY r.createdAt DESC, r.id DESC`,
    [productId]
  );

  return rows.map((row) => ({
    id: row.id,
    userId: row.userId,
    userName: row.userName,
    review: row.review,
    rating: row.rating,
    createdAt: row.createdAt,
  }));
}

async function listProducts() {
  await ensureDatabaseReady();
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT
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
     ORDER BY p.id ASC`
  );

  return Promise.all(
    rows.map(async (row) => {
      const product = mapProductRow(row);
      product.reviews = await loadReviewsForProduct(product.id);
      return product;
    })
  );
}

async function getProductById(productId) {
  await ensureDatabaseReady();
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT
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
     LIMIT 1`,
    [productId]
  );

  if (rows.length === 0) {
    return null;
  }

  const product = mapProductRow(rows[0]);
  product.reviews = await loadReviewsForProduct(product.id);
  return product;
}

async function addReview({ productId, userId, review, rating }) {
  await ensureDatabaseReady();
  const numericProductId = Number(productId);
  const numericUserId = Number(userId);
  const normalizedRating = Number(rating);

  if (!Number.isInteger(numericProductId) || !Number.isInteger(numericUserId)) {
    return { error: "Valid productId and userId are required", statusCode: 400 };
  }

  if (!review || !Number.isInteger(normalizedRating) || normalizedRating < 1 || normalizedRating > 5) {
    return { error: "Review and rating 1-5 are required", statusCode: 400 };
  }

  const pool = getPool();
  const [[product]] = await pool.query("SELECT id FROM products WHERE id = ? LIMIT 1", [numericProductId]);
  const [[user]] = await pool.query("SELECT id FROM users WHERE id = ? LIMIT 1", [numericUserId]);

  if (!product) {
    return { error: "Product not found", statusCode: 404 };
  }

  if (!user) {
    return { error: "User not found", statusCode: 404 };
  }

  const [result] = await pool.query(
    `INSERT INTO reviews (userId, productId, review, rating) VALUES (?, ?, ?, ?)`,
    [numericUserId, numericProductId, String(review), normalizedRating]
  );

  const refreshedProduct = await getProductById(numericProductId);

  return {
    review: {
      id: result.insertId,
      userId: numericUserId,
      productId: numericProductId,
      review: String(review),
      rating: normalizedRating,
      createdAt: new Date().toISOString(),
    },
    product: refreshedProduct,
  };
}

async function createProduct(data) {
  await ensureDatabaseReady();
  const pool = getPool();

  const [result] = await pool.query(
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

  return result.insertId;
}

async function updateProduct(id, data) {
  await ensureDatabaseReady();
  const pool = getPool();

  const [result] = await pool.query(
    `UPDATE products 
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
}

async function deleteProduct(id) {
  await ensureDatabaseReady();
  const pool = getPool();

  const [result] = await pool.query(
    "DELETE FROM products WHERE id=?",
    [id]
  );

  return result.affectedRows > 0;
}


module.exports = {
  addReview,
  getProductById,
  listProducts,
  mapProductRow,
  createProduct,
  updateProduct,
  deleteProduct
};
