import React, { useEffect, useState } from "react";

const API = process.env.REACT_APP_API_URL || "";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API}/api/bookings`);
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Failed to load bookings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ❌ Cancel booking (owner only)
  const cancelBooking = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (!confirm) return;

    try {
      await fetch(`${API}/api/bookings/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-key": process.env.REACT_APP_ADMIN_KEY,
        },
      });

      // update UI
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      alert("Cancellation failed");
    }
  };

  // 🔁 Reschedule booking (owner only)
  const rescheduleBooking = async (booking) => {
    const newDate = window.prompt("New date (YYYY-MM-DD):");
    if (!newDate) return;

    const newTime = window.prompt("New time (24h HH:MM):");
    if (!newTime) return;

    try {
      const res = await fetch(
        `${API}/api/bookings/${booking._id}/reschedule`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-admin-key": process.env.REACT_APP_ADMIN_KEY,
          },
          body: JSON.stringify({ date: newDate, time: newTime }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Reschedule failed");
        return;
      }

      // update UI with new booking
      setBookings((prev) =>
        prev.map((b) => (b._id === booking._id ? data : b))
      );
    } catch (err) {
      alert("Reschedule failed");
    }
  };

  if (loading) return <p className="p-6">Loading bookings...</p>;

  const formatWhen = (b) => {
  // New bookings (have start)
  if (b?.start) {
    const d = new Date(b.start);
    if (!isNaN(d.getTime())) return d.toLocaleString();
  }

  // Old bookings (no start) — show date + time separately (no parsing needed)
  if (b?.date) {
    const dd = new Date(b.date);
    const dateStr = isNaN(dd.getTime()) ? String(b.date) : dd.toLocaleDateString();
    const timeStr = b?.time ? ` ${b.time}` : "";
    return `${dateStr}${timeStr}`;
  }

  return "No date";
};


  return (
    <div className="max-w-5xl mx-auto p-6 font-bodonimoda">
      <h1 className="text-2xl text-purplecolor mb-6">
        Admin – Bookings
      </h1>

      {bookings.length === 0 && (
        <p className="text-gray-500">No bookings found.</p>
      )}

      <div className="space-y-4">
        {bookings.map((b) => (
          <div
            key={b._id}
            className="border border-black/10 rounded-lg p-4 flex justify-between items-start"
          >
            <div>
              <p className="font-semibold">{b.name}</p>
              <p className="text-sm text-gray-600">
                {formatWhen(b)}
              </p>
              <p className="text-sm text-gray-500">
                Duration: {b.duration} min
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => rescheduleBooking(b)}
                className="text-purplecolor font-semibold hover:underline"
              >
                Reschedule
              </button>

              <button
                onClick={() => cancelBooking(b._id)}
                className="text-red-600 font-semibold hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
