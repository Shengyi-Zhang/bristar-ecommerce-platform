import { useEffect, useMemo, useState } from "react";
import { adminProducts, productsApi } from "../../services/adminApi";
import ProductForm from "./ProductForm";

const PER_PAGE = 8;

export default function AdminProducts() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);

  const [q, setQ] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("updated_desc");

  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState(null); // null | "create" | "edit"
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(1);

  const load = async (query = q) => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        adminProducts.list(query),
        productsApi.categories(),
      ]);

      setItems(productsRes.products || []);
      setCategories(categoriesRes.categories || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load("").catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 当筛选条件变化时，回到第一页
  useEffect(() => {
    setPage(1);
  }, [q, selectedCategory, sortBy]);

  const filteredSorted = useMemo(() => {
    let list = [...items];

    // category filter
    if (selectedCategory) {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // sort
    list.sort((a, b) => {
      switch (sortBy) {
        case "updated_asc":
          return new Date(a.updatedAt || 0) - new Date(b.updatedAt || 0);
        case "name_asc":
          return (a.name?.en || a.name?.zh || a.slug || "").localeCompare(
            b.name?.en || b.name?.zh || b.slug || "",
          );
        case "name_desc":
          return (b.name?.en || b.name?.zh || b.slug || "").localeCompare(
            a.name?.en || a.name?.zh || a.slug || "",
          );
        case "updated_desc":
        default:
          return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
      }
    });

    return list;
  }, [items, selectedCategory, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / PER_PAGE));

  const pagedItems = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return filteredSorted.slice(start, start + PER_PAGE);
  }, [filteredSorted, page]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          Products
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Create, edit, delete, and manage product records for the storefront.
        </p>
      </div>

      {/* Toolbar */}
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12 xl:items-end">
          <div className="xl:col-span-5">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Search
            </label>
            <div className="flex gap-3">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by slug, code, or name..."
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900"
              />
              <button
                onClick={() => load().catch(console.error)}
                disabled={loading}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Loading..." : "Search"}
              </button>
            </div>
          </div>

          <div className="xl:col-span-3">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="xl:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Sort
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900"
            >
              <option value="updated_desc">Newest first</option>
              <option value="updated_asc">Oldest first</option>
              <option value="name_asc">Name A-Z</option>
              <option value="name_desc">Name Z-A</option>
            </select>
          </div>

          <div className="xl:col-span-2">
            <div className="flex gap-3 xl:justify-end">
              <button
                onClick={() => {
                  setMode("create");
                  setEditing(null);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-black"
              >
                + New
              </button>

              <button
                onClick={() => load("").catch(console.error)}
                disabled={loading}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      {mode ? (
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <ProductForm
            mode={mode}
            initialProduct={editing}
            onCancel={() => {
              setMode(null);
              setEditing(null);
            }}
            onSaved={async () => {
              setMode(null);
              setEditing(null);
              await load("");
            }}
          />
        </div>
      ) : null}

      {/* Summary */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500">
        <div>
          Showing{" "}
          <span className="font-medium text-gray-900">{pagedItems.length}</span>{" "}
          of{" "}
          <span className="font-medium text-gray-900">
            {filteredSorted.length}
          </span>{" "}
          products
        </div>
        <div>
          Page <span className="font-medium text-gray-900">{page}</span> /{" "}
          <span className="font-medium text-gray-900">{totalPages}</span>
        </div>
      </div>

      {/* Products list */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Existing Products
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Review and manage your current product catalog.
          </p>
        </div>

        {loading ? (
          <div className="px-5 py-8 text-sm text-gray-500">
            Loading products...
          </div>
        ) : !pagedItems.length ? (
          <div className="px-5 py-8 text-sm text-gray-500">
            No products found.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {pagedItems.map((p) => (
              <ProductRow
                key={p.slug}
                product={p}
                onEdit={() => {
                  setMode("edit");
                  setEditing(p);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onDeleted={async () => {
                  await load("");
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setPage(1)}
            disabled={page === 1}
            className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            « First
          </button>

          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ‹ Prev
          </button>

          <span className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white">
            {page}
          </span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
            className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next ›
          </button>

          <button
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Last »
          </button>
        </div>
      )}
    </div>
  );
}

function ProductRow({ product, onEdit, onDeleted }) {
  const [removing, setRemoving] = useState(false);

  const remove = async () => {
    if (!confirm(`Delete ${product.slug}?`)) return;

    try {
      setRemoving(true);
      await adminProducts.remove(product.slug);
      await onDeleted();
    } catch (e) {
      console.error(e);
      alert("Failed to delete product.");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="px-5 py-5">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12 xl:items-start">
        {/* Image */}
        <div className="xl:col-span-2">
          <div className="flex h-28 w-full items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.slug}
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="text-sm text-gray-400">No image</span>
            )}
          </div>
        </div>

        {/* Main info */}
        <div className="xl:col-span-5">
          <div className="space-y-1">
            <div className="text-lg font-semibold leading-tight text-gray-900">
              {product.name?.en || "—"}
            </div>
            <div className="text-base text-gray-600">
              {product.name?.zh || "—"}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-200">
              {product.category || "No category"}
            </span>

            {product.isNewItem ? (
              <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200">
                New Item
              </span>
            ) : null}

            {product.code ? (
              <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-200">
                {product.code}
              </span>
            ) : null}
          </div>

          <div className="mt-4 space-y-1 text-sm text-gray-500">
            <div>
              <span className="font-medium text-gray-700">Slug:</span>{" "}
              {product.slug}
            </div>

            <div>
              <span className="font-medium text-gray-700">EN:</span>{" "}
              {product.desc?.en || "—"}
            </div>

            <div>
              <span className="font-medium text-gray-700">ZH:</span>{" "}
              {product.desc?.zh || "—"}
            </div>
          </div>
        </div>

        {/* URL / meta */}
        <div className="xl:col-span-3">
          <div className="space-y-2 text-sm text-gray-500">
            <div className="font-medium text-gray-700">Image URL</div>
            <div className="break-all rounded-xl bg-gray-50 px-3 py-2 text-xs text-gray-500 ring-1 ring-gray-200">
              {product.imageUrl || "No image URL"}
            </div>

            {product.imageKey ? (
              <>
                <div className="pt-1 font-medium text-gray-700">Image Key</div>
                <div className="break-all rounded-xl bg-gray-50 px-3 py-2 text-xs text-gray-500 ring-1 ring-gray-200">
                  {product.imageKey}
                </div>
              </>
            ) : null}
          </div>
        </div>

        {/* Actions */}
        <div className="xl:col-span-2">
          <div className="flex gap-2 xl:justify-end">
            <button
              onClick={onEdit}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Edit
            </button>

            <button
              onClick={remove}
              disabled={removing}
              className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {removing ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
