import { useEffect, useState } from "react";

type Doctor = {
  id: number;
  fullName: string;
  specialization: string;
  experienceYears: number | null;
  consultationFee: number | null;
  clinicName: string | null;
  clinicCity: string | null;
};

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError(null);
        const API_BASE = import.meta.env.VITE_API_BASE_URL;
        const res = await fetch(`${API_BASE}/api/doctors`);
        if (!res.ok) {
          throw new Error("Failed to fetch doctors");
        }

        const data = (await res.json()) as Doctor[];
        setDoctors(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4 text-slate-800">
          Our Doctors
        </h1>
        <p className="text-slate-600">Loading doctors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4 text-slate-800">
          Our Doctors
        </h1>
        <p className="text-rose-600 text-sm">Error: {error}</p>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4 text-slate-800">
          Our Doctors
        </h1>
        <p className="text-slate-600">No doctors found yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-slate-800">
        Our Doctors
      </h1>

      <div className="grid gap-4 md:grid-cols-2">
        {doctors.map((doc) => (
          <div
            key={doc.id}
            className="border rounded-xl p-4 shadow-sm bg-white flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {doc.fullName}
              </h2>
              <p className="text-sm text-teal-700 font-medium">
                {doc.specialization}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {doc.experienceYears
                  ? `${doc.experienceYears} years experience`
                  : "Experience info not available"}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {doc.clinicName
                  ? `${doc.clinicName} — ${doc.clinicCity ?? ""}`
                  : "Clinic info not available"}
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-800">
                {doc.consultationFee
                  ? `₹${doc.consultationFee} / consultation`
                  : "Fee on request"}
              </span>
              {/* Later this button will route to /book/:id */}
              <button className="px-3 py-1.5 text-xs rounded-md bg-teal-600 text-white hover:bg-teal-700">
                Book now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsPage;
