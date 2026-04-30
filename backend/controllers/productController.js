const dataStore = require("../models/dataStore");
const { deleteFileIfExists } = require("../lib/fileHelper");

exports.getAllProducts = async (req, res) => {
  try {
    const result = await dataStore.listProducts();

    res.json({
      message: "Success get all products",
      products: result
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const productId = Number(req.params.id);

    if (!Number.isInteger(productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await dataStore.getProductById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Success get product detail",
      product
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const imagePath = req.file ? req.file.path : null;

    if (!imagePath) {
      return res.status(400).json({
        status: false,
        message: "File gambar harus disertakan saat membuat produk",
        code: "NO_IMAGE_PROVIDED",
      });
    }

    const id = await dataStore.createProduct({
      ...req.body,
      image: imagePath,
    });

    res.status(201).json({
      status: true,
      message: "Produk berhasil dibuat",
      productId: id,
      fileInfo: {
        filename: req.file.filename,
        size: req.file.size,
        path: imagePath,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid product id",
      });
    }

    const product = await dataStore.getProductById(id);

    if (!product) {
      return res.status(404).json({
        status: false,
        message: "Produk tidak ditemukan",
      });
    }

    const updateData = {
      ...req.body,
    };

    if (req.file) {
      updateData.image = req.file.path;

      if (product.image) {
        deleteFileIfExists(product.image);
      }
    }

    await dataStore.updateProduct(id, updateData);

    const responseData = {
      status: true,
      message: "Produk berhasil diupdate",
    };

    if (req.file) {
      responseData.fileInfo = {
        filename: req.file.filename,
        size: req.file.size,
        path: req.file.path,
      };
    }

    res.json(responseData);

  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await dataStore.getProductById(id);

    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    deleteFileIfExists(product.image);

    const success = await dataStore.deleteProduct(id);

    res.json({ message: "Produk berhasil dihapus" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const productId = Number(req.params.id);

    if (!Number.isInteger(productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const result = await dataStore.addReview({
      productId,
      userId: req.user.id,
      review: req.body.review,
      rating: req.body.rating,
    });

    if (result.error) {
      return res.status(result.statusCode || 400).json({
        message: result.error
      });
    }

    res.status(201).json({
      message: "Review berhasil ditambahkan",
      review: result.review,
      product: result.product
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};