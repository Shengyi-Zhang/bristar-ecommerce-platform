import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { adminAuth } from "../../services/adminApi";
import AdminNav from "./AdminNav";

export default function AdminLayout() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    adminAuth
      .me()
      .then((data) => {
        setAuthed(true);
        setAdmin(data.admin);
      })
      .catch(() => {
        setAuthed(false);
        setAdmin(null);
      })
      .finally(() => setReady(true));
  }, []);

  if (!ready) return <div style={{ padding: 20 }}>Loading...</div>;

  if (!authed) return <Navigate to="/admin/login" replace />;

  return (
    <div>
      <AdminNav admin={admin} />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: 16 }}>
        <Outlet context={{ admin }} />
      </div>
    </div>
  );
}
