const fs = require("fs");
const path = require("path");

const deleteFileIfExists = (filePath) => {
  try {
    if (!filePath) return;

    console.log("TRY DELETE:", filePath);
    const fullPath = path.normalize(filePath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log("File deleted:", fullPath);
    } else {
      console.warn("File not found:", fullPath);
    }
  } catch (error) {
    console.error("Error deleting file:", error.message);
  }
};

module.exports = {
  deleteFileIfExists,
};