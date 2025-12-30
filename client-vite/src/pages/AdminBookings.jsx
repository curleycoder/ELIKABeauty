import React, { useEffect, useMemo, useState } from "react";

const ADMIN_KEY_STORAGE = "beautyshohre_admin_key";
const API_BASE = "https://api.beautyshohrestudio.ca/api/bookings"; // you said this is what you're using
const SHOP_TZ = "America/Vancouver";

function getAdminKey() {
  const saved = localStorage.getItem(ADMIN_KEY_STORAGE);
  if (saved) return saved;

  const key = window.prompt("Enter Admin Key:");
  if (!key) return "";
  localStorage.setItem(ADMIN_KEY_STORAGE, key);
  return key;
}

async function parseError(res) {
  try {
    const data = await res.json();
    return data?.error || JSON.stringify(data);
  } catch {
    return res.statusText || "Request failed";
  }
}

// Best-effort booking "start" timestamp for sorting/grouping
function getStartMs(b) {
  if (b?.start) {
    const d = new Date(b.start);
    const ms = d.getTime();
    if (!Number.isNaN(ms)) return ms;
  }
  // fallback: date only (midnight UTC-ish) — not perfect, but keeps UI stable
  if (b?.date) {
    const d = new Date(b.date);
    const ms = d.getTime();
    if (!Number.isNaN(ms)) return ms;
  }
  return Number.POSITIVE_INFINITY;
}

function formatDateHeader(ms) {
  return new Date(ms).toLocaleDateString("en-CA", {
    timeZone: SHOP_TZ,
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTime(b) {
  const start = b?.start ? new Date(b.start) : null;
  if (start && !Number.isNaN(start.getTime())) {
    return start.toLocaleTimeString("en-US", {
      timeZone: SHOP_TZ,
      hour: "numeric",
      minute: "2-digit",
    });
  }
  return b?.time || "No time";
}

function formatContact(b) {
  return `${b?.email || "No email"} • ${b?.phone || "No phone"}`;
}

function servicesText(b) {
  const arr = Array.isArray(b?.services) ? b.services : [];
  const names = arr
    .map((s) => (typeof s === "string" ? s : s?.name))
    .filter(Boolean);
  return names.length ? names.join(", ") : "No services";
}

// Vancouver "today start" and "tomorrow start" in user's browser, computed by locale string trick.
// Good enough for UI filtering (backend should enforce the real rules anyway).
function getTodayStartMsVancouver() {
  const now = new Date();
  const ymd = now.toLocaleDateString("en-CA", { timeZone: SHOP_TZ }); // YYYY-MM-DD
  // create a Date at local midnight; this is approximate but consistent for filtering in UI
  return new Date(`${ymd}T00:00:00`).getTime();
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

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
      if (!Array.isArray(data)) throw new Error("Invalid data (expected array).");

      setBookings(data);
    } catch (err) {
      console.error("❌ Failed to load bookings:", err);
      setBookings([]);
      setErrorMsg(err?.message || "Failed to load bookings");
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

    const ok = window.confirm(`Cancel booking for ${booking?.name || "this client"}?`);
    if (!ok) return;

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: { "x-admin-key": adminKey },
      });

      if (!res.ok) throw new Error(await parseError(res));

      setBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, status: "cancelled", cancelledAt: new Date().toISOString() } : b
        )
      );
    } catch (err) {
      console.error("❌ Cancel failed:", err);
      alert(err?.message || "Cancellation failed");
    }
  };

  const clearKey = () => {
    localStorage.removeItem(ADMIN_KEY_STORAGE);
    setErrorMsg("Admin key cleared. Refresh and re-enter it.");
  };

  // ✅ FILTER: Today + Upcoming only, and group by date; cancelled separate inside each day
  const grouped = useMemo(() => {
    const todayStart = getTodayStartMsVancouver();

    // 1) filter today+upcoming based on start ms
    const upcoming = bookings
      .map((b) => ({ b, ms: getStartMs(b) }))
      .filter((x) => x.ms !== Number.POSITIVE_INFINITY && x.ms >= todayStart);

    // 2) sort by start time asc
    upcoming.sort((a, b) => a.ms - b.ms);

    // 3) group by date header (Vancouver)
    const map = new Map(); // key: dateHeader, value: { dateMs, active:[], cancelled:[] }
    for (const { b, ms } of upcoming) {
      const key = formatDateHeader(ms);
      if (!map.has(key)) map.set(key, { dateMs: ms, active: [], cancelled: [] });

      const bucket = map.get(key);
      if (b?.status === "cancelled") bucket.cancelled.push({ b, ms });
      else bucket.active.push({ b, ms });
    }

    // 4) convert to array in date order
    return Array.from(map.entries())
      .map(([dateLabel, payload]) => ({
        dateLabel,
        dateMs: payload.dateMs,
        active: payload.active,
        cancelled: payload.cancelled,
      }))
      .sort((a, b) => a.dateMs - b.dateMs);
  }, [bookings]);

  if (loading) return <p className="p-6">Loading bookings…</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-[#55203d]">Admin – Today / Upcoming</h1>
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

      {grouped.length === 0 ? (
        <p className="text-gray-600">No upcoming bookings found.</p>
      ) : (
        <div className="space-y-6">
          {grouped.map((day) => (
            <div key={day.dateLabel} className="rounded border p-4">
              <div className="font-bold text-[#55203d] mb-3">📆 {day.dateLabel}</div>

              {/* ACTIVE */}
              {day.active.length > 0 && (
                <div className="space-y-3">
                  {day.active.map(({ b }) => (
                    <div key={b._id} className="p-3 rounded border">
                      <div className="flex justify-between items-start gap-3">
                        <div>
                          <div className="font-semibold text-[#55203d]">
                            {b?.name?.trim() ? b.name : "No name"}
                          </div>
                          <div className="text-sm text-gray-700">{formatContact(b)}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            ⏰ {formatTime(b)}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            💇 {servicesText(b)}
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

              {/* CANCELLED */}
              {day.cancelled.length > 0 && (
                <div className="mt-4">
                  <div className="text-sm font-semibold text-red-700 mb-2">Cancelled</div>
                  <div className="space-y-3">
                    {day.cancelled.map(({ b }) => (
                      <div key={b._id} className="p-3 rounded border bg-red-50">
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <div className="font-semibold text-[#55203d]">
                              {b?.name?.trim() ? b.name : "No name"}
                              <span className="ml-2 text-red-600 font-semibold">CANCELLED</span>
                            </div>
                            <div className="text-sm text-gray-700">{formatContact(b)}</div>
                            <div className="text-sm text-gray-600 mt-1">
                              ⏰ {formatTime(b)}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              💇 {servicesText(b)}
                            </div>
                          </div>

                          <button
                            disabled
                            className="text-gray-400 cursor-not-allowed font-semibold"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {day.active.length === 0 && day.cancelled.length === 0 && (
                <p className="text-gray-600">No bookings.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
