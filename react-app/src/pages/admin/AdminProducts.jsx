// src/pages/admin/AdminProducts.jsx
import { useEffect, useMemo, useState } from "react";
import { adminAuth, adminProducts } from "../../services/adminApi";
import ProductForm from "./ProductForm";

export default function AdminProducts() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  // form state
  const [mode, setMode] = useState(null); // null | "create" | "edit"
  const [editing, setEditing] = useState(null);

  const load = async (query = q) => {
    setLoading(true);
    try {
      const data = await adminProducts.list(query);
      setItems(data.products || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load("").catch(console.error);
  }, []);

  const filtered = useMemo(() => items, [items]);

  return (
    <div style={{ maxWidth: 1150, margin: "20px auto", padding: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <h2 style={{ fontSize: 24, fontWeight: 800 }}>Admin Products</h2>
        <button
          onClick={async () => {
            await adminAuth.logout();
            location.href = "/admin";
          }}
        >
          Logout
        </button>
      </div>

      {/* toolbar */}
      <div
        style={{
          display: "flex",
          gap: 8,
          margin: "12px 0",
          alignItems: "center",
        }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search (slug/code/name)..."
          style={{ flex: 1, padding: 10 }}
        />
        <button onClick={() => load().catch(console.error)} disabled={loading}>
          {loading ? "..." : "Search"}
        </button>
        <button
          onClick={() => {
            setMode("create");
            setEditing(null);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          + New
        </button>
        <button
          onClick={() => load("").catch(console.error)}
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      {/* form */}
      {mode ? (
        <div style={{ marginBottom: 14 }}>
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

      {/* list */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 12,
          overflow: "hidden",
          background: "#fff",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "120px 1fr 260px",
            gap: 12,
            padding: 10,
            background: "#fafafa",
            fontWeight: 800,
            borderBottom: "1px solid #eee",
          }}
        >
          <div>Image</div>
          <div>Info</div>
          <div style={{ textAlign: "right" }}>Actions</div>
        </div>

        {filtered.map((p) => (
          <div
            key={p.slug}
            style={{
              display: "grid",
              gridTemplateColumns: "120px 1fr 260px",
              gap: 12,
              padding: 10,
              borderBottom: "1px solid #eee",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 110,
                height: 80,
                background: "#f7f7f7",
                borderRadius: 8,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {p.imageUrl ? (
                <img
                  src={p.imageUrl}
                  alt={p.slug}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <span style={{ fontSize: 12, color: "#999" }}>No image</span>
              )}
            </div>

            <div>
              <div style={{ fontWeight: 800 }}>
                {p.name?.en || p.name?.zh || p.slug}
              </div>
              <div style={{ color: "#666", marginTop: 2 }}>
                {p.category} • {p.code || "(no code)"} • isNewItem:{" "}
                {String(!!p.isNewItem)}
              </div>
              <div style={{ color: "#777", marginTop: 2, fontSize: 12 }}>
                slug: {p.slug}
              </div>
            </div>

            <div
              style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}
            >
              <button
                onClick={() => {
                  setMode("edit");
                  setEditing(p);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Edit
              </button>

              <button
                onClick={async () => {
                  if (!confirm(`Delete ${p.slug}?`)) return;
                  await adminProducts.remove(p.slug);
                  await load("");
                }}
                style={{ color: "crimson" }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {!filtered.length && !loading ? (
          <div style={{ padding: 14, color: "#666" }}>No products found.</div>
        ) : null}
      </div>

      <div style={{ fontSize: 12, color: "#666", marginTop: 10 }}>
        Tip: Upload image → save → product.imageUrl will point to S3 public URL.
      </div>
    </div>
  );
}
