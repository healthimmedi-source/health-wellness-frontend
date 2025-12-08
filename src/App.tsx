import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DoctorsPage from "./pages/DoctorsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PatientDashboardPage from "./pages/PatientDashboardPage";
import BookAppointmentPage from "./pages/BookAppointmentPage";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow">
        <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold text-teal-700">
            WellnessCare
          </Link>

          <div className="flex gap-3 text-sm items-center">
            <Link to="/" className="text-slate-700 hover:text-teal-700">
              Home
            </Link>

            <Link to="/doctors" className="text-slate-700 hover:text-teal-700">
              Doctors
            </Link>

            {user && (
              <>
                <Link
                  to="/dashboard"
                  className="text-slate-700 hover:text-teal-700"
                >
                  Dashboard
                </Link>

                {/* TEMP: shortcut to book page for doctor #1 */}
                <Link
                  to="/book/1"
                  className="text-slate-700 hover:text-teal-700"
                >
                  Book appointment
                </Link>
              </>
            )}

            {/* Auth controls */}
            {!user && (
              <>
                <Link
                  to="/login"
                  className="text-slate-700 hover:text-teal-700 ml-4"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 rounded-md bg-teal-600 text-white hover:bg-teal-700"
                >
                  Sign up
                </Link>
              </>
            )}

            {user && (
              <>
                <span className="text-xs text-slate-600 ml-2">
                  Logged in as{" "}
                  <span className="font-semibold">{user.email}</span>
                </span>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 rounded-md bg-rose-500 text-white hover:bg-rose-600 text-xs"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Page content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<PatientDashboardPage />} />
          <Route path="/book/:doctorId" element={<BookAppointmentPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 mt-8">
        <div className="max-w-6xl mx-auto px-4 py-4 text-sm">
          © {new Date().getFullYear()} WellnessCare Center
        </div>
      </footer>
    </div>
  );
};

export default App;
