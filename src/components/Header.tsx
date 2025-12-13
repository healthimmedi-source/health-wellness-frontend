import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo + Name */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/immedihealth-logo.jpg"
            alt="ImmediHealth"
            className="h-9 w-9 object-contain"
          />
          <div className="leading-tight">
            <div className="font-semibold text-slate-900">ImmediHealth</div>
            <div className="text-xs text-slate-600">AND WELLNESS CENTER</div>
          </div>
        </Link>

        {/* Right: Links */}
        <nav className="flex items-center gap-4 text-sm">
          <Link className="text-slate-700 hover:text-slate-900" to="/">
            Home
          </Link>
          <Link className="text-slate-700 hover:text-slate-900" to="/doctors">
            Doctors
          </Link>
        
          {/* ✅ NEW: Book Appointment */}
          <Link
            to={`/book/4`}
            className="rounded-md bg-teal-600 px-3 py-1.5 font-medium text-white hover:bg-teal-700"
          >
            Book Appointment
          </Link>

          {!user ? (
            <>
              <Link className="text-slate-700 hover:text-slate-900" to="/login">
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-md bg-teal-600 text-white px-3 py-2 hover:bg-teal-700"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              <span className="text-slate-600 hidden sm:inline">
                {user.email}
              </span>
              <button
                onClick={logout}
                className="rounded-md border px-3 py-2 hover:bg-slate-50"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}