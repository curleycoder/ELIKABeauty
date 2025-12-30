import React, { useEffect, useState } from "react";

const ADMIN_KEY_STORAGE = "beautyshohre_admin_key";
const API_BASE = "https://api.beautyshohrestudio.ca/api/admin/bookings";
const SHOP_TZ = "America/Vancouver";

function formatWhen(b) {
  const start = b?.start ? new Date(b.start) : null;

  const dateStr = start
    ? start.toLocaleDateString("en-CA", {
        timeZone: SHOP_TZ,
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : b?.date
    ? new Date(b.date).toLocaleDateString("en-CA", { timeZone: SHOP_TZ })
    : "No date";

  const timeStr = start
    ? start.toLocaleTimeString("en-US", {
        timeZone: SHOP_TZ,
        hour: "numeric",
        minute: "2-digit",
      })
    : b?.time || "No time";

  return `${dateStr} • ${timeStr}`;
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const getAdminKey = () => {
    const saved = localStorage.getItem(ADMIN_KEY_STORAGE);
    if (saved) return saved;

    const key = window.prompt("Enter Admin Key:");
    if (!key) return "";
    localStorage.setItem(ADMIN_KEY_STORAGE, key);
    return key;
  };

  const parseError = async (res) => {
    try {
      const data = await res.json();
      return data?.error || JSON.stringify(data);
    } catch {
      return res.statusText || "Request failed";
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    setErrorMsg("");

    const adminKey = getAdminKey();
    if (!adminKey) {
      setErrorMsg("Admin key is required.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(API_BASE, {
        headers: { "x-admin-key": adminKey },
      });

      if (!res.ok) throw new Error(await parseError(res));

      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid data");

      setBookings(data);
    } catch (err) {
      console.error("❌ Failed to load bookings:", err);
      setBookings([]);
      setErrorMsg(err.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cancelBooking = async (id) => {
    const adminKey = getAdminKey();
    if (!adminKey) return;

    const booking = bookings.find((b) => b._id === id);
    if (!booking || booking.status === "cancelled") return;

    const ok = window.confirm(`Cancel booking for ${booking.name || "this client"}?`);
    if (!ok) return;

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: { "x-admin-key": adminKey },
      });

      if (!res.ok) throw new Error(await parseError(res));

      setBookings((prev) =>
        prev.map((b) =>
          b._id === id
            ? { ...b, status: "cancelled", cancelledAt: new Date().toISOString() }
            : b
        )
      );
    } catch (err) {
      console.error("❌ Cancel failed:", err);
      alert(err.message || "Cancellation failed");
    }
  };

  const clearKey = () => {
    localStorage.removeItem(ADMIN_KEY_STORAGE);
    setErrorMsg("Admin key cleared. Refresh and re-enter it.");
  };

  if (loading) return <p className="p-6">Loading bookings…</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-[#55203d]">Admin – Bookings</h1>
        <div className="flex gap-2">
          <button onClick={fetchBookings} className="px-3 py-2 rounded bg-[#55203d] text-white">
            Refresh
          </button>
          <button onClick={clearKey} className="px-3 py-2 rounded border text-[#55203d]">
            Clear Key
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 border border-red-200 bg-red-50 text-red-700 rounded">
          {errorMsg}
        </div>
      )}

      {bookings.length === 0 ? (
        <p className="text-gray-600">No bookings found.</p>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => {
            const isCancelled = b.status === "cancelled";
            return (
              <div key={b._id} className="p-4 border rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-[#55203d]">
                      {b.name || "No name"}
                    </div>

                    <div className="text-sm text-gray-700">
                      {b.email || "No email"} • {b.phone || "No phone"}
                      {isCancelled && (
                        <span className="ml-2 text-red-600 font-semibold">
                          CANCELLED
                        </span>
                      )}
                    </div>

                    <div className="text-sm text-gray-600 mt-1">
                      {formatWhen(b)}
                    </div>

                    <div className="text-sm text-gray-600 mt-1">
                      {Array.isArray(b.services) && b.services.length > 0 ? (
                        <span>
                          {b.services
                            .map((s) => (typeof s === "string" ? s : s?.name))
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      ) : (
                        "No services"
                      )}
                    </div>

                  </div>

                  <button
                    onClick={() => cancelBooking(b._id)}
                    disabled={isCancelled}
                    className={
                      isCancelled
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-red-600 font-semibold"
                    }
                  >
                    Cancel
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
