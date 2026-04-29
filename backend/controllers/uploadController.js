const path = require("path");
const fs = require("fs");

/**
 * Upload controller untuk menangani file uploads
 * Menyediakan utilitas untuk validasi dan pengelolaan file
 */

/**
 * Handle single file upload dan return file info
 * @param {Object} file - Express file object dari multer
 * @returns {Object|null} File info atau null jika tidak ada file
 */
const getFileInfo = (file) => {
  if (!file) return null;

  return {
    filename: file.filename,
    originalName: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    path: file.path,
    relativePath: file.path.replace(/\\/g, "/").split("uploads/")[1], // Path relatif dari uploads/
  };
};

/**
 * Validasi apakah file sudah ada di path yang diberikan
 * @param {string} filePath - Absolute path ke file
 * @returns {boolean} True jika file ada
 */
const fileExists = (filePath) => {
  return fs.existsSync(filePath);
};

/**
 * Delete file dari disk jika ada
 * @param {string} filePath - Path ke file yang akan dihapus
 * @returns {boolean} True jika berhasil dihapus atau file tidak ada
 */
const deleteFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error.message);
  }
  return false;
};

/**
 * Normalizes file path untuk consistency (Windows & Unix)
 * @param {string} filePath - Path yang akan di-normalize
 * @returns {string} Normalized path
 */
const normalizePath = (filePath) => {
  if (!filePath) return null;
  return filePath.replace(/\\/g, "/");
};

/**
 * Get file size in human readable format
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size string
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

module.exports = {
  getFileInfo,
  fileExists,
  deleteFile,
  normalizePath,
  formatFileSize,
};
