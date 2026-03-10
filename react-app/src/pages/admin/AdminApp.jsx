import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { adminAuth } from "../../services/adminApi";
import AdminLogin from "./AdminLogin";

export default function AdminApp() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    adminAuth
      .me()
      .then(() => setAuthed(true))
      .catch(() => setAuthed(false))
      .finally(() => setReady(true));
  }, []);

  if (!ready) return <div style={{ padding: 20 }}>Loading...</div>;

  if (authed) {
    return <Navigate to="/admin" replace />;
  }

  return <AdminLogin onLoggedIn={() => (window.location.href = "/admin")} />;
}
