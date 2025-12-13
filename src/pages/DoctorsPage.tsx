import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type Doctor = {
  id: number | string;
  user?: { fullName?: string | null } | null;
  specialization?: string | null;
  experienceYears?: number | null;
  consultationFee?: number | null;
  clinic?: {
    name?: string | null;
    city?: string | null;
    state?: string | null;
  } | null;
};

function normalizeBaseUrl(url: string) {
  return url.replace(/\/+$/, ""); // remove trailing slashes
}

const DoctorsPage = () => {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = useMemo(() => {
    // support multiple env var names (keep the one you already use)
    const raw =
      (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
      (import.meta.env.VITE_API_URL as string | undefined) ||
      (import.meta.env.VITE_API as string | undefined) ||
      "http://localhost:4000";

    return normalizeBaseUrl(raw);
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE}/api/doctors`);
        if (!res.ok) {
          throw new Error(`Failed to fetch doctors (${res.status})`);
        }

        const data = (await res.json()) as Doctor[];
        setDoctors(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error(err);
        setError(err?.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [API_BASE]);

  const handleBook = (doctorId: Doctor["id"]) => {
    if (doctorId === null || doctorId === undefined || doctorId === "") {
      alert("Doctor id missing. Please refresh and try again.");
      return;
    }
    navigate(`/book/${doctorId}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-slate-800">
        Our Doctors
      </h1>

      {loading && <p className="text-slate-600">Loading doctors...</p>}

      {!loading && error && (
        <p className="text-rose-600 text-sm">Error: {error}</p>
      )}

      {!loading && !error && doctors.length === 0 && (
        <p className="text-slate-600">No doctors found yet.</p>
      )}

      {!loading && !error && doctors.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {doctors.map((doc) => {
            const fullName = doc.user?.fullName ?? "Doctor";
            const specialization = doc.specialization ?? "Specialty not listed";
            const exp =
              doc.experienceYears !== null && doc.experienceYears !== undefined
                ? `${doc.experienceYears} years experience`
                : "Experience info not available";

            const clinicName = doc.clinic?.name ?? null;
            const clinicCity = doc.clinic?.city ?? null;
            const clinicState = doc.clinic?.state ?? null;

            const clinicLine = clinicName
              ? `${clinicName}${clinicCity ? ` — ${clinicCity}` : ""}${
                  clinicState ? `, ${clinicState}` : ""
                }`
              : "Clinic info not available";

            const fee =
              doc.consultationFee !== null && doc.consultationFee !== undefined
                ? `₹${doc.consultationFee} / consultation`
                : "Fee on request";

            return (
              <div
                key={String(doc.id)}
                className="border rounded-xl p-4 shadow-sm bg-white flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {fullName}
                  </h2>

                  <p className="text-sm text-teal-700 font-medium">
                    {specialization}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">{exp}</p>

                  <p className="text-xs text-slate-500 mt-1">{clinicLine}</p>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-800">
                    {fee}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleBook(doc.id)}
                    className="px-3 py-1.5 text-xs rounded-md bg-teal-600 text-white hover:bg-teal-700"
                  >
                    Book now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DoctorsPage;