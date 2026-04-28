const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define upload directories
const uploadsDir = path.join(__dirname, "../uploads");
const productsDir = path.join(uploadsDir, "products");
const categoriesDir = path.join(uploadsDir, "categories");

// Create directories if they don't exist
[uploadsDir, productsDir, categoriesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine destination based on route or req.body
    let uploadDir = productsDir;
    
    if (req.path.includes("categories")) {
      uploadDir = categoriesDir;
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: timestamp-random.ext
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const ext = path.extname(file.originalname);
    const filename = `${timestamp}-${random}${ext}`;
    
    cb(null, filename);
  }
});

// Configure file filter for validation
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/jpg", "application/pdf"];
  const allowedExts = [".jpg", ".jpeg", ".png", ".gif", ".pdf"];
  
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedMimes.includes(file.mimetype) && allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipe file tidak didukung. Hanya ${allowedExts.join(", ")} yang diizinkan.`), false);
  }
};

// Create multer instance with configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});

module.exports = {
  upload,
  uploadsDir,
  productsDir,
  categoriesDir
};
