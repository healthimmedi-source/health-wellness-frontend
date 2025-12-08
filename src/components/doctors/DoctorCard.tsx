import { Link } from "react-router-dom";

export interface Doctor {
  id: number;
  fullName: string;
  specialization: string;
  experienceYears?: number;
  consultationFee?: number;
  clinicName?: string;
  clinicCity?: string;
}

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg p-4 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          {doctor.fullName}
        </h3>
        <p className="text-sm text-teal-700 font-medium">
          {doctor.specialization}
        </p>
        {(doctor.clinicName || doctor.clinicCity) && (
          <p className="text-xs text-slate-500 mt-1">
            {doctor.clinicName}
            {doctor.clinicCity ? ` • ${doctor.clinicCity}` : ""}
          </p>
        )}
        {doctor.experienceYears != null && (
          <p className="text-xs text-slate-500 mt-1">
            {doctor.experienceYears}+ years of experience
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        {doctor.consultationFee != null && (
          <p className="text-sm text-slate-800 font-semibold">
            ₹ {doctor.consultationFee}
            <span className="text-xs text-slate-500"> / session</span>
          </p>
        )}

        <Link
          to={`/book/${doctor.id}`}
          className="px-3 py-1.5 text-xs rounded-md bg-teal-600 text-white hover:bg-teal-700"
        >
          Book now
        </Link>
      </div>
    </div>
  );
};

export default DoctorCard;
