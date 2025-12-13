// src/components/doctors/DoctorCard.tsx
import { Link } from "react-router-dom";

type Doctor = {
  id?: string;
  _id?: string;
  name: string;
  specialty: string;
  experience: number;
  location: string;
  price: number;
};

export default function DoctorCard({ doctor }: { doctor: Doctor }) {
  const doctorId = doctor.id ?? doctor._id; // supports either field

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{doctor.name}</h3>
          <div className="text-sm text-slate-600">{doctor.specialty}</div>
          <div className="mt-2 text-sm text-slate-600">
            {doctor.experience} years experience
          </div>
          <div className="text-sm text-slate-600">{doctor.location}</div>
          <div className="mt-3 font-medium">₹{doctor.price} / consultation</div>
        </div>

        {doctorId ? (
          <Link
            to={`/book/${doctorId}`}
            className="rounded-md bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-700"
          >
            Book now
          </Link>
        ) : (
          <button
            disabled
            className="rounded-md bg-slate-300 px-3 py-1.5 text-sm font-medium text-white"
            title="Doctor ID missing"
          >
            Book now
          </button>
        )}
      </div>
    </div>
  );
}