// src/pages/admin/ProductForm.jsx
import { useEffect, useMemo, useState } from "react";
import { adminProducts, adminS3 } from "../../services/adminApi";
import { productsApi } from "../../services/adminApi";

const emptyProduct = {
  slug: "",
  code: "",
  category: "",
  isNewItem: false,
  imageKey: "",
  name: { en: "", zh: "" },
  desc: { en: "", zh: "" },
  imageUrl: "",
};

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

function normalizeProduct(p) {
  const base = p || {};
  return {
    slug: base.slug || "",
    code: base.code || "",
    category: base.category || "",
    isNewItem: !!base.isNewItem,
    imageKey: base.imageKey || "",
    name: {
      en: base.name?.en || "",
      zh: base.name?.zh || "",
    },
    desc: {
      en: base.desc?.en || "",
      zh: base.desc?.zh || "",
    },
    imageUrl: base.imageUrl || "",
  };
}

export default function ProductForm({
  mode, // "create" | "edit"
  initialProduct,
  onCancel,
  onSaved,
}) {
  const [form, setForm] = useState(() =>
    mode === "edit" ? normalizeProduct(initialProduct) : emptyProduct,
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    productsApi.categories().then((res) => setCategories(res.categories));
  }, []);

  useEffect(() => {
    if (mode === "edit") setForm(normalizeProduct(initialProduct));
    else setForm(emptyProduct);
  }, [mode, initialProduct]);

  const title = useMemo(
    () => (mode === "edit" ? "Edit Product" : "Create Product"),
    [mode],
  );

  const update = (path, value) => {
    setForm((prev) => {
      const next = structuredClone(prev);
      // simple path setter: "name.en" / "desc.zh"
      const keys = path.split(".");
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]];
      cur[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const validate = () => {
    if (!form.slug.trim()) return "slug is required";
    if (!form.category.trim()) return "category is required";

    if (!form.name.en.trim() && !form.name.zh.trim())
      return "name.en or name.zh is required";
    return "";
  };

  const uploadToS3 = async (file) => {
    // 1) presign
    const presign = await adminS3.presignPut(
      file.name,
      file.type || "application/octet-stream",
    );

    // 2) PUT upload
    const putRes = await fetch(presign.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type || "application/octet-stream" },
      body: file,
    });

    if (!putRes.ok) throw new Error("S3 upload failed");
    return { publicUrl: presign.publicUrl, key: presign.key };
  };

  const handlePickFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setErr("");
      setUploading(true);

      // Delete old image from S3 if exists
      const oldKey = form.imageKey;
      const { publicUrl, key } = await uploadToS3(file);
      update("imageUrl", publicUrl);
      update("imageKey", key);

      if (oldKey) {
        try {
          await adminS3.deleteObject(oldKey);
        } catch (e) {
          console.warn("Failed to delete old S3 object:", oldKey, e?.message);
        }
      }
    } catch (e2) {
      console.error(e2);
      setErr("Upload failed. Check S3 settings/credentials.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    const msg = validate();
    if (msg) {
      setErr(msg);
      return;
    }

    try {
      setErr("");
      setSaving(true);

      if (mode === "create") {
        await adminProducts.create(form);
      } else {
        // slug，编辑时禁用 slug 输入
        await adminProducts.update(form.slug, form);
      }

      onSaved?.();
    } catch (e) {
      console.error(e);
      setErr("Save failed. Check console/network.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 12,
        padding: 16,
        background: "#fff",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "center",
        }}
      >
        <h3 style={{ fontSize: 20, fontWeight: 800 }}>{title}</h3>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onCancel} disabled={saving || uploading}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving || uploading}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {err ? (
        <div style={{ marginTop: 10, color: "crimson" }}>{err}</div>
      ) : null}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginTop: 12,
        }}
      >
        <Field label="Slug (unique)" required>
          <input
            value={form.slug}
            disabled
            placeholder="auto-generated from Name (EN)"
            style={{ width: "100%", padding: 10, background: "#f7f7f7" }}
          />
        </Field>

        <Field label="Code">
          <input
            value={form.code}
            onChange={(e) => update("code", e.target.value)}
            placeholder="e.g. AGTH101"
            style={{ width: "100%", padding: 10 }}
          />
        </Field>

        <Field label="Category" required>
          <select
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            style={{ width: "100%", padding: 10 }}
          >
            <option value="">Select category</option>

            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <Field label="New Item?">
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: 10,
              border: "1px solid #ddd",
              borderRadius: 8,
            }}
          >
            <input
              type="checkbox"
              checked={form.isNewItem}
              onChange={(e) => update("isNewItem", e.target.checked)}
            />
            <span>{form.isNewItem ? "true" : "false"}</span>
          </label>
        </Field>

        <Field label="Name (EN)" required>
          <input
            value={form.name.en}
            onChange={(e) => {
              const val = e.target.value;

              setForm((prev) => ({
                ...prev,
                name: {
                  ...prev.name,
                  en: val,
                },
                ...(mode === "create" ? { slug: slugify(val) } : {}), // 创建时自动生成 slug
              }));
            }}
            placeholder="English name"
            style={{ width: "100%", padding: 10 }}
          />
        </Field>

        <Field label="Name (ZH)">
          <input
            value={form.name.zh}
            onChange={(e) => update("name.zh", e.target.value)}
            placeholder="中文名称"
            style={{ width: "100%", padding: 10 }}
          />
        </Field>

        <Field label="Desc (EN)">
          <input
            value={form.desc.en}
            onChange={(e) => update("desc.en", e.target.value)}
            placeholder="e.g. 24can/320ml"
            style={{ width: "100%", padding: 10 }}
          />
        </Field>

        <Field label="Desc (ZH)">
          <input
            value={form.desc.zh}
            onChange={(e) => update("desc.zh", e.target.value)}
            placeholder="例如：24罐/320毫升"
            style={{ width: "100%", padding: 10 }}
          />
        </Field>

        <Field label="Image URL">
          <input
            value={form.imageUrl}
            onChange={(e) => update("imageUrl", e.target.value)}
            placeholder="S3 public URL or /assets/..."
            style={{ width: "100%", padding: 10 }}
          />
        </Field>

        <Field label="Upload Image to S3">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="file"
              accept="image/*"
              onChange={handlePickFile}
              disabled={uploading}
            />
            {uploading ? <span>Uploading...</span> : null}
          </div>
          <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
            Upload → auto fills Image URL
          </div>
        </Field>
      </div>

      {form.imageUrl ? (
        <div
          style={{
            marginTop: 14,
            display: "flex",
            gap: 14,
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 140,
              height: 110,
              background: "#f7f7f7",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <img
              src={form.imageUrl}
              alt="preview"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          </div>
          <div style={{ fontSize: 12, color: "#666", wordBreak: "break-all" }}>
            {form.imageUrl}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>
        {label} {required ? <span style={{ color: "crimson" }}>*</span> : null}
      </div>
      {children}
    </div>
  );
}
