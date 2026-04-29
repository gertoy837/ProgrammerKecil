const dataStore = require("../models/dataStore");

exports.getCategories = async (req, res) => {
  try {
    const categories = await dataStore.listCategories();
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file ? req.file.filename : null;
    const id = await dataStore.createCategory(name, image);

    res.status(201).json({
      message: "Kategori berhasil dibuat",
      id,
      image,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name } = req.body;
    const image = req.file ? req.file.filename : undefined;
    const success = await dataStore.updateCategory(id, name, image);

    if (!success) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }

    res.json({ message: "Kategori berhasil diupdate" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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