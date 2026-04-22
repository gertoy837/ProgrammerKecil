const dataStore = require("../models/dataStore");
const { createAccessToken } = require("../lib/authToken");

exports.login = async (req, res) => {
  try {
    const result = await dataStore.authenticateUser(req.body);

    if (result.error) {
      return res.status(result.statusCode || 400).json({ message: result.error });
    }

    if (result.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied (Admin only)" });
    }

    res.json({
      user: result.user,
      token: createAccessToken(result.user),
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getCurrentAdmin = (req, res) => {
  res.json({ user: req.user });
};

exports.updateProfile = async (req, res) => {
  try {
    const result = await dataStore.updateUserProfile(req.user.id, req.body);

    if (result.error) {
      return res.status(result.statusCode || 400).json({ message: result.error });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.logout = (req, res) => {
  res.json({ message: "Logout successful" });
};