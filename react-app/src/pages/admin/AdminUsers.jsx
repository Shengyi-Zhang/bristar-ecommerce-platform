import { useEffect, useState } from "react";
import { adminUsers } from "../../services/adminApi";

export default function AdminUsers() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    role: "editor",
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminUsers.list();
      setItems(data.admins || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load().catch(console.error);
  }, []);

  const createOne = async () => {
    try {
      setErr("");

      if (!form.email.trim() || !form.password.trim()) {
        setErr("Email and password are required.");
        return;
      }

      setCreating(true);
      await adminUsers.create(form);
      setForm({
        email: "",
        password: "",
        name: "",
        role: "editor",
      });
      await load();
    } catch (e) {
      console.error(e);
      setErr("Failed to create admin.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          Manage Admins
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Create, update, deactivate, or remove admin accounts.
        </p>
      </div>

      {err ? (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {err}
        </div>
      ) : null}

      {/* Create admin card */}
      <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Create Admin</h2>
          <p className="mt-1 text-sm text-gray-500">
            Add a new admin account with editor or super access.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="xl:col-span-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
            />
          </div>

          <div className="xl:col-span-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm((p) => ({ ...p, password: e.target.value }))
              }
            />
          </div>

          <div className="xl:col-span-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
          </div>

          <div className="xl:col-span-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900"
              value={form.role}
              onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
            >
              <option value="editor">editor</option>
              <option value="super">super</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={createOne}
              disabled={creating}
              className="w-full rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creating ? "Creating..." : "Create Admin"}
            </button>
          </div>
        </div>
      </div>

      {/* Existing admins */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Existing Admins
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Update role, active status, or reset password.
          </p>
        </div>

        {loading ? (
          <div className="px-5 py-8 text-sm text-gray-500">
            Loading admins...
          </div>
        ) : !items.length ? (
          <div className="px-5 py-8 text-sm text-gray-500">
            No admins found.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {items.map((a) => (
              <AdminUserRow
                key={a._id || a.id || a.email}
                admin={a}
                onChanged={load}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminUserRow({ admin, onChanged }) {
  const [name, setName] = useState(admin.name || "");
  const [role, setRole] = useState(admin.role || "editor");
  const [isActive, setIsActive] = useState(!!admin.isActive);
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);

  const save = async () => {
    try {
      setSaving(true);
      await adminUsers.update(admin._id || admin.id, {
        name,
        role,
        isActive,
        ...(password ? { password } : {}),
      });
      setPassword("");
      await onChanged();
    } catch (e) {
      console.error(e);
      alert("Failed to save admin changes.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!confirm(`Delete ${admin.email}?`)) return;

    try {
      setRemoving(true);
      await adminUsers.remove(admin._id || admin.id);
      await onChanged();
    } catch (e) {
      console.error(e);
      alert("Failed to delete admin.");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="px-5 py-5">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12 xl:items-center">
        <div className="xl:col-span-3">
          <div className="text-sm font-medium text-gray-900">{admin.email}</div>
          <div className="mt-1 flex items-center gap-2">
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                isActive
                  ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                  : "bg-gray-100 text-gray-600 ring-1 ring-gray-200"
              }`}
            >
              {isActive ? "active" : "inactive"}
            </span>
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                role === "super"
                  ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                  : "bg-gray-100 text-gray-700 ring-1 ring-gray-200"
              }`}
            >
              {role}
            </span>
          </div>
        </div>

        <div className="xl:col-span-2">
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
            Name
          </label>
          <input
            className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="xl:col-span-2">
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
            Role
          </label>
          <select
            className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="editor">editor</option>
            <option value="super">super</option>
          </select>
        </div>

        <div className="xl:col-span-2">
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
            Reset password
          </label>
          <input
            type="password"
            placeholder="New password"
            className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="xl:col-span-1">
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
            Status
          </label>
          <label className="flex h-[42px] items-center gap-2 rounded-xl border border-gray-300 px-3">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <span className="text-sm text-gray-700">Active</span>
          </label>
        </div>

        <div className="xl:col-span-2 flex gap-2 xl:justify-end">
          <button
            onClick={save}
            disabled={saving}
            className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
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
  );
}
