import { useAuth } from "../auth/AuthContext";

interface Appointment {
  id: number;
  doctorName: string;
  specialization: string;
  date: string;
  startTime: string;
  endTime: string;
  clinicName: string;
  status: "BOOKED" | "COMPLETED" | "CANCELLED";
}

// mock data for now
const mockAppointments: Appointment[] = [
  {
    id: 1,
    doctorName: "Dr. Asha Verma",
    specialization: "General Physician",
    date: "2025-12-05",
    startTime: "10:00",
    endTime: "10:30",
    clinicName: "WellnessCare Center",
    status: "BOOKED",
  },
  {
    id: 2,
    doctorName: "Dr. Neha Kapoor",
    specialization: "Psychologist",
    date: "2025-12-10",
    startTime: "16:00",
    endTime: "16:45",
    clinicName: "Mind & Wellness Clinic",
    status: "BOOKED",
  },
];

const PatientDashboardPage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <p className="text-sm text-slate-700">
        Please login to view your appointments.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">My Appointments</h1>
      {mockAppointments.length === 0 ? (
        <p className="text-sm text-slate-600">
          You don&apos;t have any appointments yet.
        </p>
      ) : (
        <div className="space-y-3">
          {mockAppointments.map((appt) => (
            <div
              key={appt.id}
              className="bg-white shadow-sm rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {appt.doctorName} – {appt.specialization}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(appt.date).toLocaleDateString()} • {appt.startTime} –{" "}
                  {appt.endTime}
                </p>
                <p className="text-xs text-slate-500">{appt.clinicName}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                {appt.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientDashboardPage;
