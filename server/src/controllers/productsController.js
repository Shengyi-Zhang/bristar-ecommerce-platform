// server/src/controllers/productsController.js
const Product = require("../models/product");

// GET /api/products?lang=en|zh&category=Beverage&isNewItem=true
const getProducts = async (req, res, next) => {
  try {
    const lang = (req.query.lang || "en").toLowerCase();
    const category = req.query.category;
    const isNewItem = req.query.isNewItem; // "true" | "false"

    const filter = {};
    if (category) filter.category = category;
    if (isNewItem === "true") filter.isNewItem = true;
    if (isNewItem === "false") filter.isNewItem = false;

    const docs = await Product.find(filter)
      .select("slug code category isNewItem name desc imageUrl updatedAt")
      .sort({ updatedAt: -1 })
      .lean();

    const pickLang = (obj) => {
      if (!obj) return "";
      if (lang === "zh") return obj.zh || obj.en || "";
      return obj.en || obj.zh || "";
    };

    const products = docs.map((p) => ({
      id: p.slug, // 兼容你前端以前用 id
      slug: p.slug,
      code: p.code || "",
      category: p.category || "",
      isNewItem: !!p.isNewItem,
      name: pickLang(p.name),
      desc: pickLang(p.desc),
      imageUrl: p.imageUrl || "",
      updatedAt: p.updatedAt,
    }));

    return res.json({ products });
  } catch (err) {
    return next(err);
  }
};

// GET /api/products/categories
const getCategories = async (req, res, next) => {
  try {
    // distinct 会返回去重后的分类数组
    const categories = await Product.distinct("category");

    // 排序：可选。简单按字母排序；你也可以以后改成自定义顺序
    categories.sort((a, b) => String(a).localeCompare(String(b)));

    return res.json({ categories });
  } catch (err) {
    return next(err);
  }
};

module.exports = { getProducts, getCategories };


