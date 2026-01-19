// src/services/productsApi.js
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

async function request(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json();
}

/**
 * GET /api/products?lang=en|zh&category=...&isNewItem=true
 */
export async function fetchProducts({ lang = "en", category, isNewItem } = {}) {
  const params = new URLSearchParams();
  params.set("lang", lang);

  if (category && category !== "__all__") params.set("category", category);
  if (typeof isNewItem === "boolean") params.set("isNewItem", String(isNewItem));

  const data = await request(`/api/products?${params.toString()}`);
  return data.products || [];
}

/**
 * GET /api/products/categories
 */
export async function fetchCategories() {
  const data = await request(`/api/products/categories`);
  return data.categories || [];
}
