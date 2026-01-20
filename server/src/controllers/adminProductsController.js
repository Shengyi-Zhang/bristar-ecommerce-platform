const Product = require("../models/product");

exports.list = async (req, res, next) => {
  try {
    const q = String(req.query.q || "").trim();
    const filter = {};
    if (q) {
      filter.$or = [
        { slug: new RegExp(q, "i") },
        { code: new RegExp(q, "i") },
        { "name.en": new RegExp(q, "i") },
        { "name.zh": new RegExp(q, "i") },
      ];
    }
    const items = await Product.find(filter).sort({ updatedAt: -1 }).lean();
    res.json({ products: items });
  } catch (e) {
    next(e);
  }
};

exports.create = async (req, res, next) => {
  try {
    const body = req.body || {};
    const created = await Product.create(body);
    res.status(201).json({ product: created });
  } catch (e) {
    next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params; // slug
    const body = req.body || {};
    const updated = await Product.findOneAndUpdate({ slug: id }, body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json({ product: updated });
  } catch (e) {
    next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params; // slug
    const deleted = await Product.findOneAndDelete({ slug: id });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
};
