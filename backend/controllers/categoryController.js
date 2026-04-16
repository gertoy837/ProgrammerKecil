const dataStore = require("../models/dataStore");

// GET ALL
exports.getCategories = async (req, res) => {
  try {
    const categories = await dataStore.listCategories();
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const id = await dataStore.createCategory(name);

    res.status(201).json({
      message: "Kategori berhasil dibuat",
      id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
exports.updateCategory = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name } = req.body;

    const success = await dataStore.updateCategory(id, name);

    if (!success) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }

    res.json({ message: "Kategori berhasil diupdate" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
exports.deleteCategory = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const success = await dataStore.deleteCategory(id);

    if (!success) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }

    res.json({ message: "Kategori berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET BY ID 🔥
exports.getCategoryById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const category = await dataStore.getCategoryById(id);

    if (!category) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }

    res.json({ category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};