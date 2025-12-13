import { useState } from "react";
import { useParams } from "react-router-dom";
import type { FormEvent } from "react";
import { useAuth } from "../auth/AuthContext";

type RouteParams = {
  doctorId: string;
};

const BookAppointmentPage = () => {
  const { doctorId } = useParams<RouteParams>();

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { token } = useAuth();

  if (!token) {
    setErrorMsg("You must be logged in to book an appointment");
    return;
  }
  if (!doctorId) {
    return (
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4 text-slate-800">
          Book Appointment
        </h1>
        <p className="text-rose-600 text-sm">Missing doctor ID in URL.</p>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg(null);

    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${API_BASE}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json",
            Authorization:`Bearer ${token}`,
         },
        body: JSON.stringify({
          doctorId: Number(doctorId),
          date,
          startTime,
          endTime,
          notes,
          patientName,
          patientEmail,
          status
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Failed to book appointment");
      }

      setStatus("success");
      // Optional: clear form
      setDate("");
      setStartTime("");
      setEndTime("");
      setNotes("");
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMsg(err.message ?? "Something went wrong");
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-slate-800">
        Book Appointment
      </h1>
      <p className="text-sm text-slate-600 mb-4">
        Booking with doctor ID <span className="font-mono">{doctorId}</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-xl shadow-sm">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Patient name
            </label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full border rounded-md px-2 py-1.5 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Patient email
            </label>
            <input
              type="email"
              value={patientEmail}
              onChange={(e) => setPatientEmail(e.target.value)}
              className="w-full border rounded-md px-2 py-1.5 text-sm"
              required
            />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded-md px-2 py-1.5 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Start time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border rounded-md px-2 py-1.5 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              End time
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border rounded-md px-2 py-1.5 text-sm"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border rounded-md px-2 py-1.5 text-sm"
            rows={3}
          />
        </div>

        {status === "error" && (
          <p className="text-xs text-rose-600">
            {errorMsg ?? "Could not book appointment."}
          </p>
        )}

        {status === "success" && (
          <p className="text-xs text-emerald-600">
            Appointment booked successfully!
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="px-4 py-2 rounded-md bg-teal-600 text-white text-sm hover:bg-teal-700 disabled:opacity-60"
        >
          {status === "submitting" ? "Booking..." : "Book appointment"}
        </button>
      </form>
    </div>
  );
};

export default BookAppointmentPage;
