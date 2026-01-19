// server/src/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const productsRoutes = require("./routes/productsRoute");

const app = express();

// 允许前端访问（开发时）
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

// ✅ API 路由
app.use("/api/products", productsRoutes);

// ✅ 统一错误处理（简单版）
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  } catch (e) {
    console.error("Failed to start server", e);
    process.exit(1);
  }
})();
