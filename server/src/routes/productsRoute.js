// server/src/routes/productsRoute.js
const express = require("express");
const router = express.Router();
const {
  getProducts,
  getCategories,
} = require("../controllers/productsController");

// /api/products/categories
router.get("/categories", getCategories);

// /api/products
router.get("/", getProducts);

module.exports = router;

