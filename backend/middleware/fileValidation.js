const multer = require("multer");

/**
 * Handle error dari multer & fileFilter
 */
const handleFileUploadError = (err, req, res, next) => {
  if (!err) return next();

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        status: false,
        message: "Ukuran file terlalu besar. Maximum 5MB.",
        code: "FILE_SIZE_EXCEEDED",
      });
    }

    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        status: false,
        message: "Terlalu banyak file. Hanya 1 file yang diizinkan.",
        code: "TOO_MANY_FILES",
      });
    }

    return res.status(400).json({
      status: false,
      message: err.message,
      code: "MULTER_ERROR",
    });
  }

  // Error dari fileFilter
  return res.status(415).json({
    status: false,
    message: err.message || "Tipe file tidak didukung",
    code: "UNSUPPORTED_MEDIA_TYPE",
  });
};


/**
 * Middleware untuk validasi upload field presence (WAJIB)
 * Memastikan file ada sebelum proses lanjut
 * Gunakan untuk: CREATE product/category
 */
const validateFilePresence = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      status: false,
      message: "File harus disertakan",
      code: "NO_FILE_PROVIDED",
    });
  }
  next();
};

/**
 * Middleware untuk validasi upload field presence (OPSIONAL)
 * File boleh tidak ada (untuk update tanpa mengubah image)
 * Gunakan untuk: UPDATE product/category
 */
const validateFilePresenceOptional = (req, res, next) => {
  // File adalah opsional, jadi langsung lanjut
  // Jika ada error dari multer, handleFileUploadError akan menanganinya
  next();
};

module.exports = {
  handleFileUploadError,
  validateFilePresence,
  validateFilePresenceOptional
  // validateFileSize,
  // validateFileType
};
