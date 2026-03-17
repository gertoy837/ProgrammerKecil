const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api", require("./routes"));

app.listen(5000, () => {
  console.log("Server running 🚀");
});