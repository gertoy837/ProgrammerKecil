const fs = require("fs");
const path = require("path");

const BACKEND_ROOT = path.resolve(__dirname, "..");

const normalizeForStorage = (filePath) => {
  if (!filePath) return null;

  const normalized = path.normalize(filePath);

  if (!path.isAbsolute(normalized)) {
    return normalized.split(path.sep).join("/");
  }

  const relativePath = path.relative(BACKEND_ROOT, normalized);

  if (!relativePath.startsWith("..") && !path.isAbsolute(relativePath)) {
    return relativePath.split(path.sep).join("/");
  }

  return normalized.split(path.sep).join("/");
};

const resolveToAbsolutePath = (filePath) => {
  if (!filePath) return null;

  const normalized = path.normalize(filePath);

  if (path.isAbsolute(normalized)) {
    return normalized;
  }

  return path.join(BACKEND_ROOT, normalized);
};

const toPublicUploadPath = (filePath) => {
  if (!filePath) return null;

  const normalized = String(filePath).replace(/\\/g, "/");
  const uploadsSegment = "/uploads/";
  const uploadsIndex = normalized.lastIndexOf(uploadsSegment);

  if (uploadsIndex >= 0) {
    return normalized.slice(uploadsIndex);
  }

  if (normalized.startsWith("uploads/")) {
    return `/${normalized}`;
  }

  if (normalized.startsWith("/")) {
    return normalized;
  }

  return `/${normalized}`;
};

const deleteFileIfExists = (filePath) => {
  try {
    if (!filePath) return;

    const fullPath = resolveToAbsolutePath(filePath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error) {
    console.error("Error deleting file:", error.message);
  }
};

module.exports = {
  deleteFileIfExists,
  normalizeForStorage,
  resolveToAbsolutePath,
  toPublicUploadPath,
};