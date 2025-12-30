import React, { useEffect, useState } from "react";

const ADMIN_KEY_STORAGE = "beautyshohre_admin_key";
const API_BASE = "https://api.beautyshohrestudio.ca/api/admin/bookings";

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
    const contentType = res.headers.get("content-type") || "";
    try {
      if (contentType.includes("application/json")) {
        const data = await res.json();
        return data?.error ? String(data.error) : JSON.stringify(data);
      }
      const text = await res.text();
      return text || res.statusText;
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
        method: "GET",
        headers: { "x-admin-key": adminKey },
      });

      if (!res.ok) {
        const msg = await parseError(res);
        // ✅ actionable hints
        const hint =
          res.status === 403
            ? " (403: Wrong key OR ADMIN_KEY is missing in your server env.)"
            : res.status === 404
            ? " (404: Server route not deployed / wrong path.)"
            : "";
        throw new Error(`${msg}${hint}`);
      }

      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Server returned invalid data (expected array).");

      setBookings(data);
    } catch (err) {
      console.error("❌ Failed to load bookings:", err);
      setBookings([]);
      setErrorMsg(err?.message || "Couldn’t load bookings.");
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

  const ok = window.confirm("Cancel this booking?");
  if (!ok) return;

  try {
    const res = await fetch(`${API_BASE}/${id}/cancel`, {
      method: "PATCH",
      headers: { "x-admin-key": adminKey },
    });

    if (!res.ok) throw new Error(await parseError(res));

    const updated = await res.json();

    setBookings((prev) => prev.map((b) => (b._id === id ? updated : b)));
  } catch (err) {
    console.error("❌ Cancel failed:", err);
    alert(err?.message || "Cancellation failed");
  }
};


  const clearKey = () => {
    localStorage.removeItem(ADMIN_KEY_STORAGE);
    setErrorMsg("Admin key cleared. Refresh and enter it again.");
  };

  if (loading) return <p className="p-6">Loading bookings…</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex font-display items-center justify-between gap-3 mb-4">
        <h1 className="text-2xl">Admin – Bookings</h1>
        <div className="flex gap-2">
          <button onClick={fetchBookings} className="px-3 py-2 rounded bg-[#55203d] text-white">
            Refresh
          </button>
          <button onClick={clearKey} className="px-3 py-2 text-[#55203d] rounded border">
            Clear Key
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-4 p-4 rounded border border-red-200 bg-red-50 text-red-700">
          {errorMsg}
          <div className="mt-2 text-xs">
            Endpoint used: <span className="font-mono">{API_BASE}</span>
          </div>
        </div>
      )}

      {bookings.length === 0 ? (
        <p className="text-gray-600">No bookings found.</p>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b._id} className="p-4 rounded border">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm text-gray-700">
                    {b?.email || "No email"} • {b?.phone || "No phone"}
                    {b?.status === "cancelled" && <span className="ml-2 text-red-600 font-semibold">CANCELLED</span>}
                  </div>
                </div>
                <button
                  onClick={() => cancelBooking(b._id)}
                  className="text-red-600 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
