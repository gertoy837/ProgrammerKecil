const express = require("express");
const cors = require("cors");
require("dotenv").config();

const apiRoutes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", apiRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running 🚀 on port ${port}`);
});