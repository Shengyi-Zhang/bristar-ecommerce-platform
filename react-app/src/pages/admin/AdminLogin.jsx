import { useState } from "react";
import { adminAuth } from "../../services/adminApi";

export default function AdminLogin({ onLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
        Admin Login
      </h2>
      {err ? (
        <div style={{ color: "crimson", marginBottom: 8 }}>{err}</div>
      ) : null}

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        style={{ width: "100%", padding: 10, marginBottom: 8 }}
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      />

      <button
        style={{ width: "100%", padding: 10 }}
        onClick={async () => {
          setErr("");
          try {
            await adminAuth.login(email, password);
            onLoggedIn?.();
          } catch (e) {
            setErr("Login failed");
          }
        }}
      >
        Sign in
      </button>
    </div>
  );
}
