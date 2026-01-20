import { useEffect, useState } from "react";
import { adminAuth, adminProducts } from "../../services/adminApi";

export default function AdminProducts() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");

  const load = async () => {
    const data = await adminProducts.list(q);
    setItems(data.products || []);
  };

  useEffect(() => {
    load().catch(console.error);
  }, []);

  return (
    <div style={{ maxWidth: 1100, margin: "20px auto", padding: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>Admin Products</h2>
        <button
          onClick={async () => {
            await adminAuth.logout();
            location.href = "/admin";
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search..."
          style={{ flex: 1, padding: 10 }}
        />
        <button onClick={() => load().catch(console.error)}>Search</button>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        {items.map((p) => (
          <div
            key={p.slug}
            style={{
              display: "grid",
              gridTemplateColumns: "120px 1fr 120px",
              gap: 12,
              padding: 10,
              borderBottom: "1px solid #eee",
            }}
          >
            <img
              src={p.imageUrl}
              alt={p.slug}
              style={{
                width: 100,
                height: 80,
                objectFit: "contain",
                background: "#f7f7f7",
              }}
            />
            <div>
              <div style={{ fontWeight: 700 }}>
                {p.name?.en || p.name?.zh || p.slug}
              </div>
              <div style={{ color: "#666" }}>
                {p.category} • {p.code}
              </div>
              <div style={{ color: "#666" }}>
                isNewItem: {String(p.isNewItem)}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 8,
              }}
            >
              {/* 编辑 */}
              <button
                onClick={async () => {
                  if (!confirm(`Delete ${p.slug}?`)) return;
                  await adminProducts.remove(p.slug);
                  await load();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
