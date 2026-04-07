const express = require("express");
const cors = require("cors");
require("dotenv").config();

// 1. Import rute-rute secara spesifik
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// 2. Gunakan rute (Menggantikan app.use("/api", require("./routes")))
app.use("/api", authRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running 🚀 on port ${port}`);
});