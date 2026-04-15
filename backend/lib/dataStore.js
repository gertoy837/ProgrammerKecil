const crypto = require("crypto");
const mysql = require("mysql2/promise");

let poolPromise;
let initializationPromise;

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto
    .pbkdf2Sync(password, salt, 120000, 64, "sha512")
    .toString("hex");

  return { salt, hash };
}

function parseConnectionFromEnv() {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) {
    const parsed = new URL(databaseUrl);

    return {
      host: parsed.hostname,
      port: parsed.port ? Number(parsed.port) : 3306,
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      database: parsed.pathname.replace(/^\//, ""),
    };
  }

  return {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "programmerkecil",
  };
}

function getPool() {
  if (!poolPromise) {
    const connectionConfig = parseConnectionFromEnv();

    poolPromise = mysql.createPool({
      ...connectionConfig,
      waitForConnections: true,
      connectionLimit: 10,
      namedPlaceholders: true,
    });
  }

  return poolPromise;
}

async function ensureDatabaseReady() {
  if (!initializationPromise) {
    initializationPromise = initializeDatabase().catch((error) => {
      initializationPromise = undefined;
      throw error;
    });
  }

  return initializationPromise;
}

async function initializeDatabase() {
  const connectionConfig = parseConnectionFromEnv();
  const bootstrapPool = mysql.createPool({
    host: connectionConfig.host,
    port: connectionConfig.port,
    user: connectionConfig.user,
    password: connectionConfig.password,
    waitForConnections: true,
    connectionLimit: 2,
  });

  await bootstrapPool.query(
    `CREATE DATABASE IF NOT EXISTS \`${connectionConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );

  await bootstrapPool.end();

  const pool = getPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(191) NOT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY unique_category_name (name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(191) NOT NULL,
      email VARCHAR(191) NOT NULL,
      passwordHash VARCHAR(255) NOT NULL,
      salt VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'user',
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      UNIQUE KEY unique_user_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(191) NOT NULL,
      price INT NOT NULL,
      stock INT NOT NULL,
      description TEXT NOT NULL,
      image VARCHAR(191) NULL,
      categoryId INT NOT NULL,
      PRIMARY KEY (id),
      KEY idx_products_category_id (categoryId),
      CONSTRAINT fk_products_category
        FOREIGN KEY (categoryId) REFERENCES categories (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS carts (
      id INT NOT NULL AUTO_INCREMENT,
      userId INT NOT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY unique_cart_user (userId),
      CONSTRAINT fk_carts_user
        FOREIGN KEY (userId) REFERENCES users (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id INT NOT NULL AUTO_INCREMENT,
      cartId INT NOT NULL,
      productId INT NOT NULL,
      quantity INT NOT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY unique_cart_product (cartId, productId),
      KEY idx_cart_items_product_id (productId),
      CONSTRAINT fk_cart_items_cart
        FOREIGN KEY (cartId) REFERENCES carts (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
      CONSTRAINT fk_cart_items_product
        FOREIGN KEY (productId) REFERENCES products (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INT NOT NULL AUTO_INCREMENT,
      userId INT NOT NULL,
      productId INT NOT NULL,
      review TEXT NOT NULL,
      rating INT NOT NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      KEY idx_reviews_product_id (productId),
      KEY idx_reviews_user_id (userId),
      CONSTRAINT fk_reviews_user
        FOREIGN KEY (userId) REFERENCES users (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
      CONSTRAINT fk_reviews_product
        FOREIGN KEY (productId) REFERENCES products (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await pool.query(
    `INSERT IGNORE INTO categories (id, name) VALUES
      (1, 'Electronics'),
      (2, 'Accessories')`
  );

  await pool.query(
    `INSERT IGNORE INTO products (id, name, price, stock, description, image, categoryId) VALUES
      (1, 'Wireless Headphones', 499000, 12, 'Headphones nirkabel dengan noise isolation.', NULL, 1),
      (2, 'Mechanical Keyboard', 899000, 8, 'Keyboard mekanikal dengan layout compact.', NULL, 2)`
  );

  const [userCountRows] = await pool.query("SELECT COUNT(*) AS count FROM users");
  const count = userCountRows[0] ? userCountRows[0].count : 0;

  if (Number(count) === 0) {
    const { salt, hash } = hashPassword("admin123");
    await pool.query(
      `INSERT INTO users (name, email, passwordHash, salt, role) VALUES (?, ?, ?, ?, ?)`,
      ["Admin", "admin@example.com", hash, salt, "admin"]
    );
  }
}

function toPublicUser(user) {
  const { passwordHash, salt, ...publicUser } = user;
  return publicUser;
}

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

async function registerUser({ name, email, password, role = "user" }) {
  await ensureDatabaseReady();

  if (!name || !email || !password) {
    return { error: "Name, email, and password are required", statusCode: 400 };
  }

  const normalizedEmail = String(email).toLowerCase();
  const pool = getPool();
  const [existingUsers] = await pool.query(
    "SELECT id FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1",
    [normalizedEmail]
  );

  if (existingUsers.length > 0) {
    return { error: "Email is already registered", statusCode: 409 };
  }

  const { salt, hash } = hashPassword(password);
  const [result] = await pool.query(
    `INSERT INTO users (name, email, passwordHash, salt, role) VALUES (?, ?, ?, ?, ?)`,
    [String(name), normalizedEmail, hash, salt, role === "admin" ? "admin" : "user"]
  );

  return {
    user: toPublicUser({
      id: result.insertId,
      name: String(name),
      email: normalizedEmail,
      passwordHash: hash,
      salt,
      role: role === "admin" ? "admin" : "user",
      createdAt: new Date().toISOString(),
    }),
  };
}

async function authenticateUser({ email, password }) {
  await ensureDatabaseReady();

  if (!email || !password) {
    return { error: "Email and password are required", statusCode: 400 };
  }

  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT id, name, email, passwordHash, salt, role, createdAt
     FROM users
     WHERE LOWER(email) = LOWER(?)
     LIMIT 1`,
    [String(email)]
  );

  if (rows.length === 0) {
    return { error: "Invalid email or password", statusCode: 401 };
  }

  const user = rows[0];
  const { hash } = hashPassword(password, user.salt);

  if (hash !== user.passwordHash) {
    return { error: "Invalid email or password", statusCode: 401 };
  }

  return { user: toPublicUser(user) };
}

async function getCartForUser(userId) {
  await ensureDatabaseReady();
  const numericUserId = Number(userId);

  if (!Number.isInteger(numericUserId)) {
    return { error: "Invalid user id", statusCode: 400 };
  }

  const pool = getPool();
  const [cartRows] = await pool.query(
    `SELECT id, userId
     FROM carts
     WHERE userId = ?
     LIMIT 1`,
    [numericUserId]
  );

  if (cartRows.length === 0) {
    return {
      cart: {
        id: null,
        userId: numericUserId,
        items: [],
        totalPrice: 0,
      },
    };
  }

  const cart = cartRows[0];
  const [items] = await pool.query(
    `SELECT ci.id, ci.productId, ci.quantity, p.name, p.price, p.stock, p.description, p.image, p.categoryId, c.name AS categoryName
     FROM cart_items ci
     JOIN products p ON p.id = ci.productId
     LEFT JOIN categories c ON c.id = p.categoryId
     WHERE ci.cartId = ?
     ORDER BY ci.id ASC`,
    [cart.id]
  );

  const mappedItems = items.map((item) => ({
    id: item.id,
    productId: item.productId,
    quantity: item.quantity,
    product: mapProductRow({
      id: item.productId,
      name: item.name,
      price: item.price,
      stock: item.stock,
      description: item.description,
      image: item.image,
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      averageRating: null,
      reviewCount: 0,
    }),
    subtotal: item.price * item.quantity,
  }));

  return {
    cart: {
      id: cart.id,
      userId: cart.userId,
      items: mappedItems,
      totalPrice: mappedItems.reduce((total, item) => total + item.subtotal, 0),
    },
  };
}

async function addToCart({ userId, productId, quantity = 1 }) {
  await ensureDatabaseReady();
  const numericUserId = Number(userId);
  const numericProductId = Number(productId);
  const numericQuantity = Number(quantity);

  if (!Number.isInteger(numericUserId) || !Number.isInteger(numericProductId) || !Number.isInteger(numericQuantity) || numericQuantity < 1) {
    return { error: "Valid userId, productId, and quantity are required", statusCode: 400 };
  }

  const pool = getPool();
  const [users] = await pool.query("SELECT id FROM users WHERE id = ? LIMIT 1", [numericUserId]);
  const [products] = await pool.query("SELECT id FROM products WHERE id = ? LIMIT 1", [numericProductId]);

  if (users.length === 0) {
    return { error: "User not found", statusCode: 404 };
  }

  if (products.length === 0) {
    return { error: "Product not found", statusCode: 404 };
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [cartRows] = await connection.query(
      `SELECT id FROM carts WHERE userId = ? LIMIT 1 FOR UPDATE`,
      [numericUserId]
    );

    let cartId = cartRows.length > 0 ? cartRows[0].id : null;

    if (!cartId) {
      const [cartResult] = await connection.query(
        `INSERT INTO carts (userId) VALUES (?)`,
        [numericUserId]
      );
      cartId = cartResult.insertId;
    }

    const [existingItems] = await connection.query(
      `SELECT id, quantity FROM cart_items WHERE cartId = ? AND productId = ? LIMIT 1 FOR UPDATE`,
      [cartId, numericProductId]
    );

    if (existingItems.length > 0) {
      await connection.query(
        `UPDATE cart_items SET quantity = quantity + ? WHERE id = ?`,
        [numericQuantity, existingItems[0].id]
      );
    } else {
      await connection.query(
        `INSERT INTO cart_items (cartId, productId, quantity) VALUES (?, ?, ?)`,
        [cartId, numericProductId, numericQuantity]
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  return getCartForUser(numericUserId);
}

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
};