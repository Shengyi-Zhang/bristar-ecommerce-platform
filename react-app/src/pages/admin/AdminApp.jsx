import { useEffect, useState } from "react";
import { adminAuth } from "../../services/adminApi";
import AdminLogin from "./AdminLogin";
import AdminProducts from "./AdminProducts";

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

  if (!authed) {
    return <AdminLogin onLoggedIn={() => setAuthed(true)} />;
  }

  return <AdminProducts />;
}
