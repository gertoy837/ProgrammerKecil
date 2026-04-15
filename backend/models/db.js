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

module.exports = {
  ensureDatabaseReady,
  getPool,
  hashPassword,
};
