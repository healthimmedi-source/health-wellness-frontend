import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const LoginPage = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      await login({ email, password });
      navigate("/"); // or "/doctors" or "/dashboard"
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const onGoogleLogin = async () => {
    setErrorMsg(null);
    setLoading(true);

    try {
      await loginWithGoogle();
      navigate("/"); // or wherever you want
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow rounded-lg p-6">
      <h1 className="text-xl font-semibold mb-1">Welcome back</h1>
      <p className="text-sm text-slate-600 mb-4">
        Don’t have an account?{" "}
        <Link
          to="/register"
          className="text-teal-700 font-medium hover:underline"
        >
          Sign up
        </Link>
      </p>

      {errorMsg && (
        <div className="mb-4 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {errorMsg}
        </div>
      )}

      {/* Google login */}
      <button
        type="button"
        onClick={onGoogleLogin}
        disabled={loading}
        className="w-full rounded-md border bg-white py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-60"
      >
        Continue with Google
      </button>

      <div className="my-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs text-slate-500">OR</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full rounded-md border px-3 py-2 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            className="w-full rounded-md border px-3 py-2 text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-teal-600 text-white py-2 text-sm font-medium hover:bg-teal-700 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;