const path = require("path");

/**
 * Middleware untuk menangani file upload errors dari multer
 * Menangani: file size, file type, dan general multer errors
 */
const handleFileUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        status: false,
        message: "Ukuran file terlalu besar. Maximum 5MB.",
        code: "FILE_SIZE_EXCEEDED"
      });
    } else if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        status: false,
        message: "Terlalu banyak file. Hanya 1 file yang diizinkan.",
        code: "TOO_MANY_FILES"
      });
    }
  } else if (err) {
    // Custom error dari fileFilter
    return res.status(415).json({
      status: false,
      message: err.message || "Tipe file tidak didukung.",
      code: "UNSUPPORTED_MEDIA_TYPE"
    });
  }
  next();
};

/**
 * Middleware untuk validasi upload field presence
 * Memastikan file ada sebelum proses lanjut
 */
const validateFilePresence = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      status: false,
      message: "File harus disertakan dalam request.",
      code: "NO_FILE_PROVIDED"
    });
  }
  next();
};

/**
 * Middleware untuk validasi file size (alternative)
 */
const validateFileSize = (maxSizeMB = 5) => {
  return (req, res, next) => {
    if (req.file && req.file.size > maxSizeMB * 1024 * 1024) {
      return res.status(413).json({
        status: false,
        message: `Ukuran file terlalu besar. Maximum ${maxSizeMB}MB.`,
        code: "FILE_SIZE_EXCEEDED"
      });
    }
    next();
  };
};

/**
 * Middleware untuk validasi file type
 */
const validateFileType = (allowedExts = [".jpg", ".jpeg", ".png", ".gif", ".pdf"]) => {
  return (req, res, next) => {
    if (req.file) {
      const ext = path.extname(req.file.originalname).toLowerCase();
      if (!allowedExts.includes(ext)) {
        return res.status(415).json({
          status: false,
          message: `Tipe file tidak didukung. Hanya ${allowedExts.join(", ")} yang diizinkan.`,
          code: "UNSUPPORTED_MEDIA_TYPE"
        });
      }
    }
    next();
  };
};

module.exports = {
  handleFileUploadError,
  validateFilePresence,
  validateFileSize,
  validateFileType
};
