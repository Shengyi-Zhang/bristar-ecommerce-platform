// Product model (Mongoose)
// Save as: server/src/models/Product.js

const mongoose = require('mongoose');

const LocalizedStringSchema = new mongoose.Schema(
  {
    en: { type: String, default: '' },
    zh: { type: String, default: '' },
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true }, // maps from old `id`
    code: { type: String, default: '' },
    category: { type: String, required: true, index: true },
    isNewItem: { type: Boolean, default: false, index: true },

    name: { type: LocalizedStringSchema, default: () => ({}) },
    desc: { type: LocalizedStringSchema, default: () => ({}) },

    // For now this can be a relative path (e.g. /assets/...) and later replaced with S3 URL
    imageUrl: { type: String, default: '' },

    // Optional: keep original path for reference
    legacyImagePath: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
