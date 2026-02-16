import React, { useEffect, useMemo, useState } from "react";

const ADMIN_KEY_STORAGE = "elikabeauty_admin_key";
const API_BASE = "https://elikabeauty.onrender.com/api/admin/bookings";

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

// ✅ NEW: read ?id=... for deep-link highlight
function getQueryId() {
  try {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    return id && id.trim() ? id.trim() : "";
  } catch {
    return "";
  }
}

function normStatus(s) {
  return String(s || "").trim().toLowerCase();
}

// get best sortable time for booking
function getStartMs(b) {
  if (b?.start) {
    const ms = new Date(b.start).getTime();
    if (!Number.isNaN(ms)) return ms;
  }
  if (b?.date) {
    const ms = new Date(b.date).getTime();
    if (!Number.isNaN(ms)) return ms;
  }
  return Number.POSITIVE_INFINITY;
}

function ymdInVancouver(date = new Date()) {
  return date.toLocaleDateString("en-CA", { timeZone: SHOP_TZ }); // YYYY-MM-DD
}

function startOfTodayMsVancouver() {
  // Build a Date for local midnight based on Vancouver YMD (best-effort UI filtering)
  return new Date(`${ymdInVancouver()}T00:00:00`).getTime();
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
  if (b?.start) {
    const d = new Date(b.start);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleTimeString("en-US", {
        timeZone: SHOP_TZ,
        hour: "numeric",
        minute: "2-digit",
      });
    }
  }
  return b?.time || "No time";
}

function servicesText(b) {
  const arr = Array.isArray(b?.services) ? b.services : [];
  const names = arr
    .map((s) => (typeof s === "string" ? s : s?.name))
    .filter(Boolean);
  return names.length ? names.join(", ") : "No services";
}

function contactText(b) {
  return `${b?.email || "No email"} • ${b?.phone || "No phone"}`;
}

function groupByDate(items) {
  // items: [{ b, ms }]
  const map = new Map();
  for (const it of items) {
    const key = formatDateHeader(it.ms);
    if (!map.has(key)) map.set(key, { dateMs: it.ms, list: [] });
    map.get(key).list.push(it);
  }
  return Array.from(map.entries())
    .map(([dateLabel, v]) => ({ dateLabel, dateMs: v.dateMs, list: v.list }))
    .sort((a, b) => a.dateMs - b.dateMs);
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState("upcoming"); // upcoming | done | cancelled
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // ✅ NEW: highlight id from deep link
  const [highlightId, setHighlightId] = useState(() => getQueryId());

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

      // ✅ NEW: deep-link handling (tab + scroll + highlight)
      const deepId = getQueryId();
      if (deepId) {
        const found = data.find((b) => b?._id === deepId);
        if (found) {
          const st = normStatus(found?.status);
          if (st === "cancelled" || st === "canceled") {
            setTab("cancelled");
          } else {
            const ms = getStartMs(found);
            const todayStart = startOfTodayMsVancouver();
            setTab(ms < todayStart ? "done" : "upcoming");
          }

          setHighlightId(deepId);

          // scroll after render
          setTimeout(() => {
            const el = document.getElementById(`booking-${deepId}`);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 200);

          // remove highlight after a few seconds
          setTimeout(() => setHighlightId(""), 6000);
        }
      }
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

      // mark cancelled locally (so it moves into Cancelled tab immediately)
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

  const { grouped, counts } = useMemo(() => {
    const todayStart = startOfTodayMsVancouver();

    const normalized = bookings
      .map((b) => ({ b, ms: getStartMs(b) }))
      .filter((x) => x.ms !== Number.POSITIVE_INFINITY);

    const upcoming = normalized
      .filter((x) => x.b?.status !== "cancelled" && x.ms >= todayStart)
      .sort((a, b) => a.ms - b.ms);

    const done = normalized
      .filter((x) => x.b?.status !== "cancelled" && x.ms < todayStart)
      .sort((a, b) => b.ms - a.ms); // newest done first

    const cancelled = normalized
      .filter((x) => x.b?.status === "cancelled")
      .sort((a, b) => b.ms - a.ms); // newest cancelled first

    const selected = tab === "upcoming" ? upcoming : tab === "done" ? done : cancelled;

    return {
      grouped: groupByDate(selected),
      counts: {
        upcoming: upcoming.length,
        done: done.length,
        cancelled: cancelled.length,
      },
    };
  }, [bookings, tab]);

  if (loading) return <p className="p-6">Loading bookings…</p>;

  const TabButton = ({ id, label, count }) => {
    const active = tab === id;
    return (
      <button
        onClick={() => setTab(id)}
        className={[
          "px-3 py-2 rounded font-semibold",
          active ? "bg-[#55203d] text-white" : "border text-[#55203d]",
        ].join(" ")}
      >
        {label} ({count})
      </button>
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-6 pt-20">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-2xl font-bold font-theseason text-[#55203d]">Admin – Bookings</h2>
        <div className="flex gap-2">
          <button onClick={fetchBookings} className="px-3 py-2 rounded bg-[#55203d] text-white">
            Refresh
          </button>
          <button onClick={clearKey} className="px-3 py-2 rounded border text-[#55203d]">
            Clear Key
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <TabButton id="upcoming" label="Upcoming" count={counts.upcoming} />
        <TabButton id="done" label="Done" count={counts.done} />
        <TabButton id="cancelled" label="Cancelled" count={counts.cancelled} />
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 border border-red-200 bg-red-50 text-red-700 rounded">
          {errorMsg}
        </div>
      )}

      {grouped.length === 0 ? (
        <p className="text-gray-600">No bookings in this tab.</p>
      ) : (
        <div className="space-y-6">
          {grouped.map((day) => (
            <div key={day.dateLabel} className="rounded border p-4">
              <div className="font-bold text-[#55203d] mb-3">📆 {day.dateLabel}</div>

              <div className="space-y-3">
                {day.list.map(({ b }) => {
                  const isCancelled = b?.status === "cancelled";
                  const isHighlighted = highlightId && b?._id === highlightId;

                  return (
                    <div
                      id={`booking-${b._id}`} // ✅ NEW: anchor for scroll
                      key={b._id}
                      className={[
                        "p-3 rounded border transition",
                        isCancelled ? "bg-red-50" : "bg-white",
                        isHighlighted ? "ring-2 ring-[#55203d] shadow-lg" : "",
                      ].join(" ")}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div>
                          <div className="font-semibold text-[#55203d]">
                            {b?.name?.trim() ? b.name : "No name"}
                            {isCancelled && (
                              <span className="ml-2 text-red-600 font-semibold">CANCELLED</span>
                            )}
                          </div>

                          <div className="text-sm text-gray-700">{contactText(b)}</div>

                          <div className="text-sm text-gray-600 mt-1">⏰ {formatTime(b)}</div>

                          <div className="text-sm text-gray-600 mt-1">💇 {servicesText(b)}</div>
                        </div>

                        <button
                          onClick={() => cancelBooking(b._id)}
                          disabled={isCancelled || tab === "cancelled"}
                          className={[
                            "font-semibold",
                            isCancelled || tab === "cancelled"
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-red-600",
                          ].join(" ")}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
