import { useState } from "react";
import { adminAuth } from "../../services/adminApi";

export default function AdminLogin({ onLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setErr("");

      if (!email.trim() || !password.trim()) {
        setErr("Email and password are required.");
        return;
      }

      setLoading(true);
      await adminAuth.login(email, password);
      onLoggedIn?.();
    } catch (e) {
      console.error(e);
      setErr("Login failed. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto flex min-h-[80vh] max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm lg:grid-cols-2">
          {/* Left panel */}
          <div className="hidden bg-gray-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="text-sm font-medium uppercase tracking-[0.2em] text-gray-300">
                Bristar
              </div>
              <h1 className="mt-6 text-4xl font-semibold leading-tight">
                Admin Dashboard
              </h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-gray-300">
                Manage product records, upload product images, and control admin
                access from one place.
              </p>
            </div>

            <div className="text-sm text-gray-400">Internal access only</div>
          </div>

          {/* Right panel */}
          <div className="p-8 sm:p-10">
            <div className="mx-auto max-w-md">
              <div className="mb-8">
                <h2 className="text-3xl font-semibold tracking-tight text-gray-900">
                  Sign in
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Use your admin account to access the dashboard.
                </p>
              </div>

              {err ? (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {err}
                </div>
              ) : null}

              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleLogin();
                    }}
                  />
                </div>

                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
