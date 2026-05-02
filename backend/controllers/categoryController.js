const dataStore = require("../models/dataStore");
const { deleteFileIfExists } = require("../lib/fileHelper");

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
    const image = req.file ? req.file.path : null;
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

    const category = await dataStore.getCategoryById(id);

    if (!category) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }

    const image = req.file ? req.file.path : undefined;

    if (req.file && category.image) {
      deleteFileIfExists(category.image);
    }

    await dataStore.updateCategory(id, name, image);

    res.json({ message: "Kategori berhasil diupdate" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.deleteCategory = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const category = await dataStore.getCategoryById(id);

    if (!category) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }

    if (category.image) {
      deleteFileIfExists(category.image);
    }

    await dataStore.deleteCategory(id);

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