import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { signup, loginWithGoogle } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    try {
      await signup({ fullName, email, password });
      navigate("/"); // or wherever you want after signup
    } catch (err: any) {
      setErrorMsg(err?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate("/"); // or dashboard
    } catch (err: any) {
      setErrorMsg(err?.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow rounded-lg p-6">
      <h1 className="text-xl font-semibold mb-1">Create your account</h1>

      <div className="text-sm text-slate-600 mb-4">
        Already have an account?{" "}
        <Link className="text-teal-700 font-medium hover:underline" to="/login">
          Login
        </Link>
      </div>

      {errorMsg && (
        <div className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {errorMsg}
        </div>
      )}

      {/* Google sign-in */}
      <button
        onClick={onGoogle}
        disabled={loading}
        className="w-full mb-4 flex items-center justify-center gap-2 border rounded-md py-2 text-sm font-medium hover:bg-gray-50"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="w-5 h-5"
        />
        Continue with Google
      </button>

      <div className="my-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs text-slate-500">OR</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm font-medium mb-1">Full name</label>
          <input
            type="text"
            className="w-full rounded-md border px-3 py-2 text-sm"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            placeholder="John Doe"
          />
        </div>

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
          {loading ? "Please wait..." : "Sign up"}
        </button>

        <Link
          to="/login"
          className="block w-full text-center rounded-md border py-2 text-sm font-medium hover:bg-slate-50"
        >
          Go to Login
        </Link>
      </form>
    </div>
  );
};

export default RegisterPage;