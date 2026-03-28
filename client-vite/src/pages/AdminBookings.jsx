import React, { useEffect, useMemo, useState } from "react";
import { FaCalendarAlt, FaClock, FaCut } from "react-icons/fa";

const ADMIN_KEY_STORAGE = "elikabeauty_admin_key";
const API_BASE = "https://elikabeauty.onrender.com/api/admin/bookings";
const CREDITS_BASE = "https://elikabeauty.onrender.com/api/admin/credits";

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

function CreditsTab({ adminKey }) {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null); // { name, phone, birthdayMonth, birthdayCreditUsed, birthdayCreditSentYear }
  const [lookupError, setLookupError] = useState("");
  const [redeemMsg, setRedeemMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const lookup = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    setBusy(true);
    setResult(null);
    setLookupError("");
    setRedeemMsg("");
    try {
      const res = await fetch(`${CREDITS_BASE}/lookup?code=${encodeURIComponent(trimmed)}`, {
        headers: { "x-admin-key": adminKey },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Not found");
      setResult(data);
    } catch (err) {
      setLookupError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const redeem = async () => {
    if (!result || result.birthdayCreditUsed) return;
    if (!window.confirm(`Mark code ${code.trim().toUpperCase()} as redeemed for ${result.name}?`)) return;
    setBusy(true);
    setRedeemMsg("");
    try {
      const res = await fetch(`${CREDITS_BASE}/redeem`, {
        method: "POST",
        headers: { "x-admin-key": adminKey, "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      setResult((prev) => ({ ...prev, birthdayCreditUsed: true }));
      setRedeemMsg(`✅ Redeemed for ${result.name}`);
    } catch (err) {
      setRedeemMsg(`❌ ${err.message}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-md">
      <p className="text-sm text-gray-500 mb-4">
        Look up a client's birthday credit code to verify it's valid and mark it as used at checkout.
      </p>

      <div className="flex gap-2 mb-4">
        <input
          value={code}
          onChange={(e) => { setCode(e.target.value.toUpperCase()); setResult(null); setLookupError(""); setRedeemMsg(""); }}
          onKeyDown={(e) => e.key === "Enter" && lookup()}
          placeholder="BDAY-2025-XXXXXX"
          className="flex-1 border border-[#55203d]/30 rounded px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#55203d]"
        />
        <button
          onClick={lookup}
          disabled={busy || !code.trim()}
          className="px-4 py-2 rounded bg-[#55203d] text-white font-semibold disabled:opacity-40"
        >
          Look up
        </button>
      </div>

      {lookupError && (
        <div className="p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm mb-3">
          {lookupError}
        </div>
      )}

      {result && (
        <div className="p-4 rounded-lg border border-[#55203d]/20 bg-[#fdf8f8] space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Client</span>
            <span className="font-semibold text-[#55203d]">{result.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Phone</span>
            <span>{result.phone}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Birthday month</span>
            <span>{result.birthdayMonth}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Year issued</span>
            <span>{result.birthdayCreditSentYear || "—"}</span>
          </div>
          <div className="flex justify-between text-sm items-center">
            <span className="text-gray-500">Status</span>
            {result.birthdayCreditUsed ? (
              <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 text-xs font-semibold">Already redeemed</span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Valid — not yet used</span>
            )}
          </div>

          {!result.birthdayCreditUsed && (
            <button
              onClick={redeem}
              disabled={busy}
              className="mt-3 w-full py-2 rounded-full bg-[#55203d] text-white font-bold text-sm disabled:opacity-40"
            >
              Mark as Redeemed ($20 off applied)
            </button>
          )}
        </div>
      )}

      {redeemMsg && (
        <p className="mt-3 text-sm font-semibold text-[#55203d]">{redeemMsg}</p>
      )}
    </div>
  );
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState("upcoming"); // upcoming | done | cancelled | credits
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [adminKey, setAdminKey] = useState(() => localStorage.getItem(ADMIN_KEY_STORAGE) || "");

  // ✅ NEW: highlight id from deep link
  const [highlightId, setHighlightId] = useState(() => getQueryId());

  const fetchBookings = async () => {
    setLoading(true);
    setErrorMsg("");

    const adminKey = getAdminKey();
    setAdminKey(adminKey);
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
        {label}{count != null ? ` (${count})` : ""}
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
        <TabButton id="credits" label="🎂 Birthday Credits" count={null} />
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 border border-red-200 bg-red-50 text-red-700 rounded">
          {errorMsg}
        </div>
      )}

      {tab === "credits" && <CreditsTab adminKey={adminKey} />}

      {tab !== "credits" && (
        grouped.length === 0 ? (
          <p className="text-gray-600">No bookings in this tab.</p>
        ) : (
          <div className="space-y-6">
            {grouped.map((day) => (
              <div key={day.dateLabel} className="rounded border p-4">
                <div className="font-bold text-[#55203d] mb-3 flex items-center gap-2"><FaCalendarAlt /> {day.dateLabel}</div>

                <div className="space-y-3">
                  {day.list.map(({ b }) => {
                    const isCancelled = b?.status === "cancelled";
                    const isHighlighted = highlightId && b?._id === highlightId;

                    return (
                      <div
                        id={`booking-${b._id}`}
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

                            <div className="text-sm text-gray-600 mt-1 flex items-center gap-1"><FaClock className="shrink-0" /> {formatTime(b)}</div>

                            <div className="text-sm text-gray-600 mt-1 flex items-center gap-1"><FaCut className="shrink-0" /> {servicesText(b)}</div>
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
        )
      )}
    </div>
  );
}
