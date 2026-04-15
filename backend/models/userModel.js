const { ensureDatabaseReady, getPool, hashPassword } = require("./db");

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

module.exports = {
  authenticateUser,
  registerUser,
  toPublicUser,
};
