const jwt = require("jsonwebtoken");

const TOKEN_SECRET = process.env.JWT_SECRET || process.env.AUTH_TOKEN_SECRET || "programmerkecil-dev-secret";
const TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

function createAccessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    TOKEN_SECRET,
    { expiresIn: TOKEN_EXPIRES_IN }
  );
}

function verifyAccessToken(token) {
  if (!token || typeof token !== "string") {
    return null;
  }

  try {
    return jwt.verify(token, TOKEN_SECRET);
  } catch (error) {
    return null;
  }
}

module.exports = {
  createAccessToken,
  verifyAccessToken,
};