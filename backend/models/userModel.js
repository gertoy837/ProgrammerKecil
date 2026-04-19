const { ensureDatabaseReady, getPool, hashPassword, verifyPassword } = require("./db");

function toPublicUser(user) {
  const { passwordHash, salt, ...publicUser } = user;
  return publicUser;
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

  const hash = await hashPassword(password);
  const [result] = await pool.query(
    `INSERT INTO users (name, email, passwordHash, salt, role) VALUES (?, ?, ?, ?, ?)`,
    [String(name), normalizedEmail, hash, "bcrypt", role === "admin" ? "admin" : "user"]
  );

  return {
    user: toPublicUser({
      id: result.insertId,
      name: String(name),
      email: normalizedEmail,
      passwordHash: hash,
      salt: "bcrypt",
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
  const validPassword = await verifyPassword(password, user);

  if (!validPassword) {
    return { error: "Invalid email or password", statusCode: 401 };
  }

  // Upgrade legacy password hash to bcrypt after a successful login.
  if (user.salt !== "bcrypt") {
    const upgradedHash = await hashPassword(password);
    await pool.query(
      `UPDATE users SET passwordHash = ?, salt = 'bcrypt' WHERE id = ?`,
      [upgradedHash, user.id]
    );
  }

  return { user: toPublicUser(user) };
}


async function getUserProfile(id) {
  await ensureDatabaseReady();
  const pool = getPool();
  
  const [rows] = await pool.query(
    "SELECT id, name, email, role, createdAt FROM users WHERE id = ? LIMIT 1",
    [id]
  );

  if (rows.length === 0) {
    return { error: "User not found", statusCode: 404 };
  }

  return { user: rows[0] };
}

async function updateUserProfile(id, { name, email }) {
  await ensureDatabaseReady();
  const pool = getPool();

  if (email) {
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE LOWER(email) = LOWER(?) AND id != ?",
      [email, id]
    );
    if (existing.length > 0) {
      return { error: "Email already in use", statusCode: 409 };
    }
  }

  await pool.query(
    "UPDATE users SET name = ?, email = ? WHERE id = ?",
    [name, email, id]
  );

  return getUserProfile(id);
}

module.exports = {
  authenticateUser,
  registerUser,
  toPublicUser,
  getUserProfile,
  updateUserProfile,
};
