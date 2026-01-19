/**
 * Usage (PowerShell one-liner):
 *   node src/scripts/importProducts.js --mongo "mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/bristar" --file "..\react-app\src\data\products.js" --dryRun
 *
 * Notes:
 * - This script UPSERTs by `slug` (legacy `id`) so it can re-run safely.
 * - imageUrl will be:
 *     - assetsBase + legacyImagePath (if assetsBase provided)
 *     - otherwise keep original legacyImagePath (e.g. /assets/..)
 */

const path = require("path");
const mongoose = require("mongoose");
const { pathToFileURL } = require("url");

// --- simple CLI parsing (no extra deps) ---
function getArg(name) {
  const idx = process.argv.indexOf(name);
  if (idx === -1) return null;
  return process.argv[idx + 1] ?? null;
}

const mongoUri = getArg("--mongo") || process.env.MONGODB_URI;
const filePath = getArg("--file") || process.env.PRODUCTS_FILE;
const assetsBase = (getArg("--assetsBase") || process.env.ASSETS_BASE_URL || "").replace(/\/$/, "");
const dryRun = process.argv.includes("--dryRun");

if (!mongoUri) {
  console.error('Missing Mongo URI. Provide --mongo or set MONGODB_URI');
  process.exit(1);
}
if (!filePath) {
  console.error('Missing products.js path. Provide --file or set PRODUCTS_FILE');
  process.exit(1);
}

// --- Product schema inline to keep this script standalone ---
const LocalizedStringSchema = new mongoose.Schema(
  { en: { type: String, default: "" }, zh: { type: String, default: "" } },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    code: { type: String, default: "" },
    category: { type: String, required: true, index: true },

    // NOTE: mongoose warns about "isNew" reserved key. It's still allowed.
    // If you want to suppress warning:
    // { suppressReservedKeysWarning: true } as schema option below.
    isNew: { type: Boolean, default: false, index: true },

    name: { type: LocalizedStringSchema, default: () => ({}) },
    desc: { type: LocalizedStringSchema, default: () => ({}) },

    imageUrl: { type: String, default: "" },
    legacyImagePath: { type: String, default: "" },
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

/**
 * Load productData from an ESM file that exports:
 *   export const productData = [...]
 */
async function loadProductDataFromFile(productsJsPath) {
  const abs = path.resolve(productsJsPath);
  const fileUrl = pathToFileURL(abs).href;

  // IMPORTANT: Dynamic import caches modules.
  // If you re-run and want a fresh read, you can add a cache-buster:
  // const fileUrlNoCache = `${fileUrl}?t=${Date.now()}`;
  // const mod = await import(fileUrlNoCache);

  const mod = await import(fileUrl);

  const data = mod.productData;
  if (!Array.isArray(data)) {
    throw new Error('Failed to load productData array from products.js. Make sure it exports: export const productData = [...]');
  }
  return data;
}

function normalizeOne(p) {
  const slug = String(p.id || "").trim();
  if (!slug) return null;

  const legacyImagePath = String(p.image || "").trim();
  const imageUrl = assetsBase ? `${assetsBase}${legacyImagePath}` : legacyImagePath;

  return {
    slug,
    code: String(p.code || "").trim(),
    category: String(p.category || "").trim(),
    isNewItem: Boolean(p.isNewItem),

    name: {
      en: String(p.name || "").trim(),
      zh: "", // you can fill later if you have it
    },

    desc: {
      en: String(p.desc || "").trim(),
      zh: String(p.cdesc || "").trim(),
    },

    imageUrl,
    legacyImagePath,
  };
}

async function main() {
  const raw = await loadProductDataFromFile(filePath);
  const normalized = raw.map(normalizeOne).filter(Boolean);

  // Quick sanity stats
  const byCategory = normalized.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  console.log(`Loaded ${raw.length} raw products, normalized ${normalized.length}.`);
  console.log("Category counts:", byCategory);
  console.log("Example record:", normalized[0]);

  if (dryRun) {
    console.log("Dry run enabled (--dryRun). No DB writes.");
    return;
  }

  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB.");

  // Upsert by slug so script is re-runnable
  const ops = normalized.map((doc) => ({
    updateOne: {
      filter: { slug: doc.slug },
      update: { $set: doc },
      upsert: true,
    },
  }));

  const res = await Product.bulkWrite(ops, { ordered: false });

  console.log("Bulk upsert done:", {
    inserted: res.insertedCount,
    upserted: res.upsertedCount,
    modified: res.modifiedCount,
    matched: res.matchedCount,
  });

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
