import React, { useEffect, useState } from "react";

const API = ""; // not needed anymore for admin routes

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const url = `/api/admin/bookings`;
      const res = await fetch(url, { credentials: "include" });


      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("❌ Fetch bookings failed:", {
          url,
          status: res.status,
          statusText: res.statusText,
          body: text?.slice(0, 300),
        });
        throw new Error(`Fetch failed (${res.status})`);
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("❌ Unexpected bookings payload:", data);
        throw new Error("Invalid response shape from server");
      }

      setBookings(data);
    } catch (err) {
      console.error("Failed to load bookings", err);
      setErrorMsg(
        "Couldn’t load bookings. Your Admin page is probably calling the wrong API URL (or the server is down)."
      );
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const cancelBooking = async (id) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmCancel) return;

    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "DELETE",
        credentials: "include",
      });


      const bodyText = await res.text().catch(() => "");
      if (!res.ok) {
        console.error("❌ Cancel failed:", res.status, bodyText);
        alert(`Cancellation failed: ${bodyText || res.status}`);
        return;
      }

      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error("❌ Cancellation failed:", err);
      alert("Cancellation failed");
    }
  };

  const rescheduleBooking = async (booking) => {
    const newDate = window.prompt("New date (YYYY-MM-DD):");
    if (!newDate) return;

    const newTime = window.prompt("New time (24h HH:MM):");
    if (!newTime) return;

    try {
      const res = await fetch(`/api/admin/bookings/${booking._id}/reschedule`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: newDate, time: newTime }),
      });


      const data = await res.json().catch(async () => {
        const t = await res.text().catch(() => "");
        return { error: t || "Reschedule failed" };
      });

      if (!res.ok) {
        alert(data.error || "Reschedule failed");
        return;
      }

      setBookings((prev) => prev.map((b) => (b._id === booking._id ? data : b)));
    } catch (err) {
      console.error("❌ Reschedule failed:", err);
      alert("Reschedule failed");
    }
  };

  const formatWhen = (b) => {
    if (b?.start) {
      const d = new Date(b.start);
      if (!isNaN(d.getTime())) return d.toLocaleString();
    }

    if (b?.date) {
      const dd = new Date(b.date);
      const dateStr = isNaN(dd.getTime()) ? String(b.date) : dd.toLocaleDateString();
      const timeStr = b?.time ? ` ${b.time}` : "";
      return `${dateStr}${timeStr}`;
    }

    return "No date";
  };

  if (loading) return <p className="p-6">Loading bookings...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 font-bodonimoda">
      <h1 className="text-2xl text-purplecolor mb-4">Admin – Bookings</h1>

      {errorMsg && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {errorMsg}
          <div className="mt-2 text-xs text-red-600">
            Endpoint: <span className="font-mono">/api/admin/bookings</span>
          </div>
          <button
            onClick={fetchBookings}
            className="mt-3 inline-flex rounded-full bg-red-600 px-4 py-2 text-white font-semibold"
          >
            Retry
          </button>
        </div>
      )}

      {!errorMsg && bookings.length === 0 && (
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
              <p className="text-sm text-gray-600">{formatWhen(b)}</p>
              <p className="text-sm text-gray-500">Duration: {b.duration} min</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => rescheduleBooking(b)}
                className="text-green-700 font-semibold hover:underline"
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
