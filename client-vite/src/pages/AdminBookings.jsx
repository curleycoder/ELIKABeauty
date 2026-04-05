import { useEffect, useMemo, useState, useCallback } from "react";
import {
  FaCalendarAlt, FaClock, FaCut, FaChevronLeft, FaChevronRight,
  FaTimes, FaPhone, FaEnvelope, FaBirthdayCake, FaUsers, FaCalendarCheck,
  FaPlus, FaUserSlash, FaCheckCircle, FaChevronDown, FaChevronUp, FaHistory, FaCog,
  FaSync, FaKey,
} from "react-icons/fa";

const SERVICES_API = "https://elikabeauty.onrender.com/api/services";
const BOOKINGS_API  = "https://elikabeauty.onrender.com/api/bookings";

const ADMIN_KEY_STORAGE = "elikabeauty_admin_key";
const API_BASE        = "https://elikabeauty.onrender.com/api/admin/bookings";
const ADMIN_BASE      = "https://elikabeauty.onrender.com/api/admin";
const CREDITS_BASE   = "https://elikabeauty.onrender.com/api/admin/credits";
const SHOP_TZ        = "America/Vancouver";

const HOUR_START   = 9;
const HOUR_END     = 20;
const HOUR_HEIGHT  = 64;
const TOTAL_HEIGHT = (HOUR_END - HOUR_START) * HOUR_HEIGHT;

// ── Utilities ──────────────────────────────────────────────────────────────────

function getAdminKey() {
  const saved = localStorage.getItem(ADMIN_KEY_STORAGE);
  if (saved) return saved;
  const key = window.prompt("Enter Admin Key:");
  if (!key) return "";
  localStorage.setItem(ADMIN_KEY_STORAGE, key);
  return key;
}

async function parseError(res) {
  try { const d = await res.json(); return d?.error || JSON.stringify(d); }
  catch { return res.statusText || "Request failed"; }
}

function getQueryId() {
  try {
    const p = new URLSearchParams(window.location.search);
    return p.get("id")?.trim() || "";
  } catch { return ""; }
}

function normStatus(s) { return String(s || "").trim().toLowerCase(); }

function ymdVancouver(date = new Date()) {
  return date.toLocaleDateString("en-CA", { timeZone: SHOP_TZ });
}

function startOfTodayMs() {
  return new Date(`${ymdVancouver()}T00:00:00`).getTime();
}

function getStartMs(b) {
  if (b?.start) { const ms = new Date(b.start).getTime(); if (!isNaN(ms)) return ms; }
  if (b?.date)  { const ms = new Date(b.date).getTime();  if (!isNaN(ms)) return ms; }
  return Infinity;
}

function formatDateHeader(ms) {
  return new Date(ms).toLocaleDateString("en-CA", {
    timeZone: SHOP_TZ, weekday: "short", year: "numeric", month: "short", day: "numeric",
  });
}

function formatTime(b) {
  if (b?.start) {
    const d = new Date(b.start);
    if (!isNaN(d)) return d.toLocaleTimeString("en-US", { timeZone: SHOP_TZ, hour: "numeric", minute: "2-digit" });
  }
  return b?.time || "—";
}

function servicesText(b) {
  const arr = Array.isArray(b?.services) ? b.services : [];
  const names = arr.map(s => typeof s === "string" ? s : s?.name).filter(Boolean);
  if (names.length) return names.join(", ");
  const snap = Array.isArray(b?.serviceNames) ? b.serviceNames.filter(Boolean) : [];
  return snap.length ? snap.join(", ") : "No services";
}

function getServiceTotal(b) {
  const arr = Array.isArray(b?.services) ? b.services : [];
  return arr.reduce((sum, s) => sum + (typeof s === "object" ? (Number(s?.price) || 0) : 0), 0);
}

function getInitials(name) {
  return String(name || "?").trim().split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
}

function groupByDate(items) {
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

function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
  d.setHours(0, 0, 0, 0);
  return d;
}

function to12h(time24) {
  // "14:30" → "2:30 PM"
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

function parseTimeToMins(timeStr) {
  if (!timeStr) return null;
  const m = String(timeStr).match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return null;
  let h = parseInt(m[1]);
  const min = parseInt(m[2]);
  const pm = m[3].toUpperCase() === "PM";
  if (pm && h !== 12) h += 12;
  if (!pm && h === 12) h = 0;
  return h * 60 + min;
}

// ── Schedule Tab ──────────────────────────────────────────────────────────────

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS    = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function ScheduleTab({ adminKey }) {
  const [closedWeekdays, setClosedWeekdays] = useState([]);
  const [overrides, setOverrides] = useState([]);
  const [newDate, setNewDate] = useState("");
  const [newOpen, setNewOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(`${ADMIN_BASE}/schedule`, { headers: { "x-admin-key": adminKey } })
      .then(r => r.json())
      .then(d => {
        setClosedWeekdays(d.closedWeekdays ?? [0, 1]);
        setOverrides(d.overrides ?? []);
      })
      .catch(() => {});
  }, [adminKey]);

  const toggleDay = (dow) => {
    setClosedWeekdays(prev =>
      prev.includes(dow) ? prev.filter(d => d !== dow) : [...prev, dow]
    );
  };

  const addOverride = () => {
    if (!newDate) return;
    if (overrides.some(o => o.date === newDate)) return;
    setOverrides(prev => [...prev, { date: newDate, open: newOpen }]);
    setNewDate("");
  };

  const removeOverride = (date) => setOverrides(prev => prev.filter(o => o.date !== date));

  const save = async () => {
    setSaving(true); setMsg("");
    try {
      const res = await fetch(`${ADMIN_BASE}/schedule`, {
        method: "PUT",
        headers: { "x-admin-key": adminKey, "Content-Type": "application/json" },
        body: JSON.stringify({ closedWeekdays, overrides }),
      });
      if (!res.ok) throw new Error("Failed");
      setMsg("✅ Saved");
    } catch { setMsg("❌ Save failed"); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-lg space-y-8">

      {/* Days of week */}
      <div>
        <h3 className="font-bold text-[#440008] mb-1">Regular closed days</h3>
        <p className="text-xs text-gray-400 mb-4">Check the days you are normally closed.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {DAY_NAMES.map((name, dow) => (
            <button key={dow} onClick={() => toggleDay(dow)}
              className={[
                "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition",
                closedWeekdays.includes(dow)
                  ? "bg-[#440008] text-white border-[#440008]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#440008]/30",
              ].join(" ")}>
              <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${closedWeekdays.includes(dow) ? "bg-white/30 border-white/40" : "border-gray-300"}`}>
                {closedWeekdays.includes(dow) && <span className="text-white text-[10px] font-bold">✕</span>}
              </span>
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Date overrides */}
      <div>
        <h3 className="font-bold text-[#440008] mb-1">Date overrides</h3>
        <p className="text-xs text-gray-400 mb-4">
          Force a specific date open or closed — overrides the weekday rule above.
        </p>

        <div className="flex gap-2 mb-4 flex-wrap">
          <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)}
            className="border border-[#440008]/20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#440008]/20" />
          <select value={newOpen ? "open" : "closed"} onChange={e => setNewOpen(e.target.value === "open")}
            className="border border-[#440008]/20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#440008]/20">
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
          <button onClick={addOverride} disabled={!newDate}
            className="px-4 py-2 rounded-xl bg-[#440008] text-white text-sm font-semibold disabled:opacity-40">
            Add
          </button>
        </div>

        {overrides.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No overrides set.</p>
        ) : (
          <div className="space-y-2">
            {[...overrides].sort((a, b) => a.date.localeCompare(b.date)).map(o => (
              <div key={o.date} className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${o.open ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {o.open ? "Open" : "Closed"}
                  </span>
                  <span className="text-sm text-gray-700">{o.date}</span>
                </div>
                <button onClick={() => removeOverride(o.date)} className="text-gray-300 hover:text-red-400 transition">
                  <FaTimes size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button onClick={save} disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-[#440008] text-white font-semibold text-sm disabled:opacity-40">
          {saving ? "Saving…" : "Save Changes"}
        </button>
        {msg && <span className="text-sm font-semibold text-[#440008]">{msg}</span>}
      </div>
    </div>
  );
}

// ── Clients Tab ────────────────────────────────────────────────────────────────

function ClientsTab({ adminKey, bookings }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null); // { id, month, day }
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(null); // client._id

  useEffect(() => {
    fetch(`${ADMIN_BASE}/clients`, { headers: { "x-admin-key": adminKey } })
      .then(r => r.json())
      .then(data => { setClients(Array.isArray(data) ? data : []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [adminKey]);

  const filtered = clients.filter(c => {
    const q = search.toLowerCase();
    return !q || c.name?.toLowerCase().includes(q) || c.phone?.includes(q) || c.email?.toLowerCase().includes(q);
  });

  const saveBirthday = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const res = await fetch(`${ADMIN_BASE}/clients/${editing.id}`, {
        method: "PATCH",
        headers: { "x-admin-key": adminKey, "Content-Type": "application/json" },
        body: JSON.stringify({ birthdayMonth: Number(editing.month) || null, birthdayDay: Number(editing.day) || null }),
      });
      if (!res.ok) throw new Error("Failed");
      const updated = await res.json();
      setClients(prev => prev.map(c => c._id === updated._id ? updated : c));
      setEditing(null);
    } catch { alert("Failed to save birthday"); }
    finally { setSaving(false); }
  };

  if (loading) return <p className="text-sm text-gray-400">Loading clients…</p>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, phone, or email…"
          className="flex-1 border border-[#440008]/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#440008]/20 bg-white" />
        <span className="text-xs text-gray-400 shrink-0">{filtered.length} client{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="space-y-2">
        {filtered.map(c => {
          const hasBirthday = c.birthdayMonth && c.birthdayDay;
          const birthdayLabel = hasBirthday
            ? `${MONTHS[c.birthdayMonth - 1]} ${c.birthdayDay}`
            : "No birthday";

          // Visit history from bookings prop — match by phone (unique key)
          const cPhone = (c.phone || "").replace(/\s/g, "");
          const todayStr = ymdVancouver();
          const visits = (bookings || [])
            .filter(b => {
              const bPhone = (b.phone || "").replace(/\s/g, "");
              return bPhone === cPhone && b.date <= todayStr; // past + today only
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date));
          const checkedOut = visits.filter(v => v.checkout?.done);
          const totalSpent = checkedOut.reduce((s, v) => s + (v.checkout.amount || 0), 0);
          const totalTips  = checkedOut.reduce((s, v) => s + (v.checkout.tip    || 0), 0);
          const lastVisit  = visits.find(v => normStatus(v.status) !== "cancelled")?.date;
          const isOpen       = expanded === c._id;

          return (
            <div key={c._id} className="bg-white rounded-2xl border border-[#440008]/10 overflow-hidden">
              {/* Summary row */}
              <div className="px-4 py-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#440008]/10 flex items-center justify-center text-sm font-bold text-[#440008] shrink-0">
                    {getInitials(c.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-semibold text-[#440008] text-sm">{c.name || "—"}</div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg font-medium ${hasBirthday ? "bg-pink-50 text-pink-600" : "bg-gray-50 text-gray-400"}`}>
                          <FaBirthdayCake size={10} /> {birthdayLabel}
                        </span>
                        <button
                          onClick={() => setEditing({ id: c._id, month: c.birthdayMonth || "", day: c.birthdayDay || "" })}
                          className="text-xs text-[#440008]/50 hover:text-[#440008] border border-[#440008]/15 px-2.5 py-1 rounded-lg transition">
                          Edit
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-x-3 mt-0.5">
                      <a href={`tel:${c.phone}`} className="text-xs text-gray-400 hover:text-[#440008]">{c.phone}</a>
                      <a href={`mailto:${c.email}`} className="text-xs text-gray-400 hover:text-[#440008] truncate max-w-[180px]">{c.email}</a>
                    </div>

                    {/* Stats bar */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                      <span className="text-xs text-gray-500">
                        <span className="font-semibold text-[#440008]">{visits.length}</span> visit{visits.length !== 1 ? "s" : ""}
                      </span>
                      {totalSpent > 0 && (
                        <span className="text-xs text-gray-500">
                          <span className="font-semibold text-[#440008]">${totalSpent}</span> spent
                        </span>
                      )}
                      {totalTips > 0 && (
                        <span className="text-xs text-gray-500">
                          <span className="font-semibold text-[#440008]">${totalTips}</span> tips
                        </span>
                      )}
                      {lastVisit && (
                        <span className="text-xs text-gray-400">Last: {lastVisit}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expand toggle */}
              {visits.length > 0 && (
                <button
                  onClick={() => setExpanded(isOpen ? null : c._id)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 border-t border-gray-100 text-xs text-gray-400 hover:text-[#440008] hover:bg-gray-50 transition">
                  <FaHistory size={9} />
                  {isOpen ? "Hide history" : `View ${visits.length} visit${visits.length !== 1 ? "s" : ""}`}
                  {isOpen ? <FaChevronUp size={8} /> : <FaChevronDown size={8} />}
                </button>
              )}

              {/* Visit history */}
              {isOpen && (
                <div className="border-t border-gray-100 divide-y divide-gray-50">
                  {visits.map(v => {
                    const co          = v.checkout?.done ? v.checkout : null;
                    const vStatus     = normStatus(v.status);
                    const isCancelled = vStatus === "cancelled";
                    const isNoShow    = vStatus === "noshow";
                    const svcText     = servicesText(v);
                    const extras      = co?.extraServices?.map(e => `${e.name} (+$${e.price})`) || [];
                    const allServices = [...(svcText !== "No services" ? [svcText] : []), ...extras].join(", ") || "—";
                    return (
                      <div key={v._id} className={`px-4 py-3 ${isCancelled || isNoShow ? "opacity-60" : ""} ${isCancelled ? "bg-red-50/40" : isNoShow ? "bg-orange-50/40" : "bg-gray-50/60"}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-gray-700">{v.date} · {v.time}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{allServices}</div>
                            {isCancelled ? (
                              <span className="mt-1 inline-block text-[10px] font-semibold text-red-400 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-md">Cancelled</span>
                            ) : isNoShow ? (
                              <span className="mt-1 inline-block text-[10px] font-semibold text-orange-500 bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded-md">No-show</span>
                            ) : co ? (
                              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5 text-xs">
                                {co.amount != null && <span className="font-semibold text-[#440008]">${co.amount}</span>}
                                {co.tip > 0 && <span className="text-gray-400">+${co.tip} tip</span>}
                                {co.paymentMethod && <span className="text-gray-400">{co.paymentMethod === "cash" ? "💵 Cash" : "💳 Card"}</span>}
                                {co.stylist && <span className="text-gray-400">· {co.stylist}</span>}
                              </div>
                            ) : (
                              <div className="mt-1 text-[10px] text-gray-300 italic">Not checked out yet</div>
                            )}
                            {co?.notes && <div className="mt-1.5 text-xs text-gray-400 italic">"{co.notes}"</div>}
                          </div>
                          {co && (
                            <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-md">
                              <FaCheckCircle size={8} /> Paid
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Edit birthday modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-[#440008] mb-4">Edit Birthday</h3>
            <div className="flex gap-2 mb-5">
              <div className="flex-1">
                <label className="text-xs text-gray-400 mb-1 block">Month</label>
                <select value={editing.month} onChange={e => setEditing(p => ({ ...p, month: e.target.value }))}
                  className="w-full border border-[#440008]/20 rounded-xl px-3 py-2 text-sm focus:outline-none">
                  <option value="">—</option>
                  {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                </select>
              </div>
              <div className="w-24">
                <label className="text-xs text-gray-400 mb-1 block">Day</label>
                <input type="number" min="1" max="31" value={editing.day}
                  onChange={e => setEditing(p => ({ ...p, day: e.target.value }))}
                  className="w-full border border-[#440008]/20 rounded-xl px-3 py-2 text-sm focus:outline-none" />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(null)}
                className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold">
                Cancel
              </button>
              <button onClick={saveBirthday} disabled={saving}
                className="flex-1 py-2 rounded-xl bg-[#440008] text-white text-sm font-semibold disabled:opacity-40">
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Manual Booking Modal ───────────────────────────────────────────────────────

function ManualBookingModal({ onClose, onCreated }) {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "", email: "", date: "", time: "", note: "" });
  const [selectedServices, setSelectedServices] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(SERVICES_API)
      .then(r => r.json())
      .then(data => setServices(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const toggle = (id) =>
    setSelectedServices(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const field = (key) => ({
    value: form[key],
    onChange: e => setForm(p => ({ ...p, [key]: e.target.value })),
    className: "w-full border border-[#440008]/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#440008]/30",
  });

  const submit = async () => {
    if (!form.name || !form.phone || !form.email || !form.date || !form.time) {
      setError("Please fill all required fields."); return;
    }
    if (selectedServices.length === 0) { setError("Please select at least one service."); return; }
    setBusy(true); setError("");
    try {
      const res = await fetch(BOOKINGS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, time: to12h(form.time), services: selectedServices }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create booking");
      onCreated();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90dvh] flex flex-col"
        onClick={e => e.stopPropagation()}>
        <div className="bg-[#440008] px-5 py-4 flex items-center justify-between shrink-0">
          <div className="text-white font-bold text-base">New Booking</div>
          <button onClick={onClose} className="text-white/60 hover:text-white"><FaTimes /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          {[["name","Name *","text"],["phone","Phone *","tel"],["email","Email *","email"]].map(([key, label, type]) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
              <input type={type} {...field(key)} />
            </div>
          ))}

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Date *</label>
              <input type="date" min={new Date().toLocaleDateString("en-CA")} {...field("date")} />
            </div>
            <div className="w-36">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Time *</label>
              <input type="time" {...field("time")} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">Services *</label>
            <div className="grid grid-cols-2 gap-1.5 max-h-44 overflow-y-auto pr-1">
              {services.map(s => {
                const on = selectedServices.includes(s._id);
                return (
                  <button key={s._id} type="button" onClick={() => toggle(s._id)}
                    className={`text-left px-3 py-2 rounded-xl border text-xs font-medium transition ${
                      on ? "bg-[#440008] text-white border-[#440008]"
                         : "bg-white text-gray-600 border-gray-200 hover:border-[#440008]/40"
                    }`}>
                    <div>{s.name}</div>
                    <div className={`text-[10px] mt-0.5 ${on ? "text-white/60" : "text-gray-400"}`}>
                      {s.duration}min · ${s.price}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Note</label>
            <textarea rows={2} {...field("note")}
              className="w-full border border-[#440008]/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#440008]/30 resize-none" />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <div className="px-5 pb-5 flex gap-2 border-t border-gray-100 pt-4 shrink-0">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold">
            Cancel
          </button>
          <button onClick={submit} disabled={busy}
            className="flex-1 py-2.5 rounded-xl bg-[#440008] text-white text-sm font-semibold disabled:opacity-40">
            {busy ? "Booking…" : "Create Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Checkout Modal ─────────────────────────────────────────────────────────────

function CheckoutModal({ booking, onClose, onSave }) {
  const existing = booking.checkout?.done ? booking.checkout : null;
  const defaultAmount = existing?.amount != null
    ? String(existing.amount)
    : getServiceTotal(booking) > 0 ? String(getServiceTotal(booking)) : "";

  const [extraServices, setExtraServices] = useState(
    existing?.extraServices?.length ? existing.extraServices.map(e => ({ name: e.name, price: String(e.price ?? "") })) : []
  );
  const [amount, setAmount]               = useState(defaultAmount);
  const [tip, setTip]                     = useState(existing?.tip != null ? String(existing.tip) : "");
  const [paymentMethod, setPaymentMethod] = useState(existing?.paymentMethod || "");
  const [stylist, setStylist]             = useState(existing?.stylist || "");
  const [notes, setNotes]                 = useState(existing?.notes || "");
  const [busy, setBusy]                   = useState(false);
  const [error, setError]                 = useState("");

  const addExtra  = () => setExtraServices(p => [...p, { name: "", price: "" }]);
  const removeExtra = i => setExtraServices(p => p.filter((_, idx) => idx !== i));
  const updateExtra = (i, field, val) =>
    setExtraServices(p => p.map((e, idx) => idx === i ? { ...e, [field]: val } : e));

  const submit = async () => {
    if (!paymentMethod) { setError("Please select a payment method."); return; }
    if (!stylist)        { setError("Please select a stylist.");         return; }
    setBusy(true); setError("");
    try {
      await onSave(booking._id, {
        extraServices: extraServices
          .filter(e => e.name.trim())
          .map(e => ({ name: e.name.trim(), price: Number(e.price) || 0 })),
        amount:        amount !== "" ? Number(amount) : null,
        tip:           tip    !== "" ? Number(tip)    : null,
        paymentMethod,
        stylist,
        notes,
      });
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save.");
    } finally {
      setBusy(false);
    }
  };

  const bookedServices = Array.isArray(booking.services)
    ? booking.services.map(s => (typeof s === "string" ? s : s?.name)).filter(Boolean)
    : [];

  const toggle = (setter, val, current) => setter(current === val ? "" : val);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[92dvh] flex flex-col"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="bg-[#440008] px-5 py-4 flex items-start justify-between shrink-0">
          <div>
            <div className="text-white font-bold text-base">Checkout</div>
            <div className="text-white/60 text-xs mt-0.5">{booking.name} · {booking.date} at {booking.time}</div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white mt-0.5"><FaTimes /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">

          {/* Booked services (read-only) */}
          {bookedServices.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Booked services</div>
              <div className="flex flex-wrap gap-1.5">
                {bookedServices.map((s, i) => (
                  <span key={i} className="text-xs bg-[#440008]/8 text-[#440008] px-2.5 py-1 rounded-lg border border-[#440008]/15">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Extra services */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Extra services</div>
              <button onClick={addExtra}
                className="text-xs text-[#440008] font-semibold inline-flex items-center gap-1 hover:opacity-75">
                <FaPlus size={9} /> Add
              </button>
            </div>
            {extraServices.length === 0 && (
              <p className="text-xs text-gray-300 italic">None added</p>
            )}
            {extraServices.map((e, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  value={e.name} onChange={ev => updateExtra(i, "name", ev.target.value)}
                  placeholder="Service name"
                  className="flex-1 border border-[#440008]/20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#440008]/20" />
                <input
                  type="number" min="0" value={e.price} onChange={ev => updateExtra(i, "price", ev.target.value)}
                  placeholder="$"
                  className="w-20 border border-[#440008]/20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#440008]/20" />
                <button onClick={() => removeExtra(i)} className="text-gray-300 hover:text-red-400 transition px-1">
                  <FaTimes size={11} />
                </button>
              </div>
            ))}
          </div>

          {/* Amount + Tip */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Amount charged ($)</label>
              <input type="number" min="0" value={amount} onChange={e => setAmount(e.target.value)}
                placeholder="0"
                className="w-full border border-[#440008]/20 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#440008]/20" />
            </div>
            <div className="w-28">
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Tip ($)</label>
              <input type="number" min="0" value={tip} onChange={e => setTip(e.target.value)}
                placeholder="0"
                className="w-full border border-[#440008]/20 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#440008]/20" />
            </div>
          </div>

          {/* Payment method */}
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Payment method</div>
            <div className="flex gap-2">
              {["cash", "card"].map(m => (
                <button key={m} onClick={() => toggle(setPaymentMethod, m, paymentMethod)}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold capitalize transition
                    ${paymentMethod === m ? "bg-[#440008] text-white border-[#440008]" : "bg-white text-gray-500 border-gray-200 hover:border-[#440008]/30"}`}>
                  {m === "cash" ? "💵 Cash" : "💳 Card"}
                </button>
              ))}
            </div>
          </div>

          {/* Stylist */}
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Stylist</div>
            <div className="flex gap-2">
              {["Amina", "Narges"].map(s => (
                <button key={s} onClick={() => toggle(setStylist, s, stylist)}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition
                    ${stylist === s ? "bg-[#440008] text-white border-[#440008]" : "bg-white text-gray-500 border-gray-200 hover:border-[#440008]/30"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Notes</label>
            <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="e.g. sensitive scalp, loved the balayage…"
              className="w-full border border-[#440008]/20 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#440008]/20 resize-none" />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 pt-4 border-t border-gray-100 flex gap-2 shrink-0">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold">
            Cancel
          </button>
          <button onClick={submit} disabled={busy}
            className="flex-1 py-2.5 rounded-xl bg-[#440008] text-white text-sm font-semibold disabled:opacity-40">
            {busy ? "Saving…" : existing ? "Update" : "Save & Complete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Reschedule Modal ───────────────────────────────────────────────────────────

function RescheduleModal({ booking, onClose, onSave }) {
  const [date, setDate] = useState(booking.date || "");
  const [time, setTime] = useState(""); // 24h input value
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!date || !time) { setError("Please pick a date and time."); return; }
    setBusy(true);
    setError("");
    try {
      await onSave(booking._id, date, to12h(time));
      onClose();
    } catch (err) {
      setError(err.message || "Failed to reschedule.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={e => e.stopPropagation()}>
        <div className="bg-[#440008] px-5 py-4 flex items-center justify-between">
          <div>
            <div className="text-white font-bold text-base">Reschedule</div>
            <div className="text-white/60 text-xs mt-0.5">{booking.name}</div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white"><FaTimes /></button>
        </div>

        <div className="px-5 py-5 space-y-4">
          <div className="text-xs text-gray-400 bg-[#F9F7F4] rounded-xl px-3 py-2">
            Current: <span className="font-semibold text-gray-600">{booking.date} at {booking.time}</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">New date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              min={new Date().toLocaleDateString("en-CA")}
              className="w-full border border-[#440008]/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#440008]/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">New time</label>
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              className="w-full border border-[#440008]/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#440008]/30"
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <div className="px-5 pb-5 flex gap-2">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 transition">
            Cancel
          </button>
          <button onClick={handleSave} disabled={busy}
            className="flex-1 py-2.5 rounded-xl bg-[#440008] text-white text-sm font-semibold disabled:opacity-40 hover:opacity-90 transition">
            {busy ? "Saving…" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Credits Tab ────────────────────────────────────────────────────────────────

function CreditsTab({ adminKey }) {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [lookupError, setLookupError] = useState("");
  const [redeemMsg, setRedeemMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const lookup = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    setBusy(true); setResult(null); setLookupError(""); setRedeemMsg("");
    try {
      const res = await fetch(`${CREDITS_BASE}/lookup?code=${encodeURIComponent(trimmed)}`, {
        headers: { "x-admin-key": adminKey },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Not found");
      setResult(data);
    } catch (err) { setLookupError(err.message); }
    finally { setBusy(false); }
  };

  const redeem = async () => {
    if (!result || result.birthdayCreditUsed) return;
    if (!window.confirm(`Mark ${code.trim().toUpperCase()} as redeemed for ${result.name}?`)) return;
    setBusy(true); setRedeemMsg("");
    try {
      const res = await fetch(`${CREDITS_BASE}/redeem`, {
        method: "POST",
        headers: { "x-admin-key": adminKey, "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      setResult(prev => ({ ...prev, birthdayCreditUsed: true }));
      setRedeemMsg(`✅ Redeemed for ${result.name}`);
    } catch (err) { setRedeemMsg(`❌ ${err.message}`); }
    finally { setBusy(false); }
  };

  return (
    <div className="max-w-md">
      <p className="text-sm text-gray-500 mb-5">
        Look up a birthday credit code to verify it and mark it as used at checkout.
      </p>
      <div className="flex gap-2 mb-4">
        <input
          value={code}
          onChange={e => { setCode(e.target.value.toUpperCase()); setResult(null); setLookupError(""); setRedeemMsg(""); }}
          onKeyDown={e => e.key === "Enter" && lookup()}
          placeholder="BDAY-2025-XXXXXX"
          className="flex-1 border border-[#440008]/20 rounded-xl px-4 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#440008]/30 bg-white"
        />
        <button onClick={lookup} disabled={busy || !code.trim()}
          className="px-5 py-2.5 rounded-xl bg-[#440008] text-white font-semibold text-sm disabled:opacity-40">
          Look up
        </button>
      </div>

      {lookupError && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm mb-3">{lookupError}</div>
      )}

      {result && (
        <div className="rounded-2xl border border-[#440008]/15 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 bg-[#440008]/5 border-b border-[#440008]/10">
            <div className="font-bold text-[#440008] text-lg">{result.name}</div>
          </div>
          <div className="px-5 py-4 space-y-3">
            {[["Phone", result.phone], ["Birthday month", result.birthdayMonth], ["Year issued", result.birthdayCreditSentYear || "—"]].map(([label, val]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-gray-400">{label}</span>
                <span className="font-medium text-gray-800">{val}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm items-center">
              <span className="text-gray-400">Status</span>
              {result.birthdayCreditUsed
                ? <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold">Already redeemed</span>
                : <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Valid — unused</span>}
            </div>
          </div>
          {!result.birthdayCreditUsed && (
            <div className="px-5 pb-5">
              <button onClick={redeem} disabled={busy}
                className="w-full py-2.5 rounded-xl bg-[#440008] text-white font-bold text-sm disabled:opacity-40">
                Mark as Redeemed ($20 off)
              </button>
            </div>
          )}
        </div>
      )}

      {redeemMsg && <p className="mt-3 text-sm font-semibold text-[#440008]">{redeemMsg}</p>}
    </div>
  );
}

// ── Calendar View ──────────────────────────────────────────────────────────────

function CalendarView({ bookings, onCancel, onReschedule, highlightId }) {
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [selected, setSelected] = useState(null);

  const todayYmd = ymdVancouver();

  const days = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d;
    }), [weekStart]);

  const bookingsByDate = useMemo(() => {
    const map = new Map();
    for (const b of bookings) {
      if (normStatus(b?.status) === "cancelled") continue;
      const key = b?.date;
      if (!key) continue;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(b);
    }
    return map;
  }, [bookings]);

  const weekLabel = useMemo(() => {
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 6);
    const fmt = d => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return `${fmt(weekStart)} – ${fmt(end)}, ${weekStart.getFullYear()}`;
  }, [weekStart]);

  const timeLabels = useMemo(() =>
    Array.from({ length: HOUR_END - HOUR_START + 1 }, (_, i) => {
      const h = HOUR_START + i;
      const disp = h > 12 ? h - 12 : h === 0 ? 12 : h;
      return { h, label: `${disp}${h < 12 ? "am" : "pm"}` };
    }), []);

  const dateKey = d => d.toLocaleDateString("en-CA");

  return (
    <div>
      {/* Week navigation */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setWeekStart(d => { const n = new Date(d); n.setDate(n.getDate() - 7); return n; })}
            className="p-2 rounded-lg hover:bg-[#440008]/10 text-[#440008] transition">
            <FaChevronLeft size={11} />
          </button>
          <span className="font-semibold text-[#440008] text-sm px-2">{weekLabel}</span>
          <button
            onClick={() => setWeekStart(d => { const n = new Date(d); n.setDate(n.getDate() + 7); return n; })}
            className="p-2 rounded-lg hover:bg-[#440008]/10 text-[#440008] transition">
            <FaChevronRight size={11} />
          </button>
        </div>
        <button
          onClick={() => setWeekStart(getWeekStart(new Date()))}
          className="px-3 py-1.5 rounded-lg border border-[#440008]/25 text-[#440008] text-xs font-semibold hover:bg-[#440008]/5 transition">
          Today
        </button>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Day headers */}
        <div className="grid border-b border-gray-100 bg-gray-50/60" style={{ gridTemplateColumns: "52px repeat(7, minmax(80px, 1fr))" }}>
          <div />
          {days.map((d, i) => {
            const ymd = dateKey(d);
            const isToday = ymd === todayYmd;
            return (
              <div key={i} className={`py-3 text-center border-l border-gray-100 ${isToday ? "bg-[#440008]/5" : ""}`}>
                <div className="text-[10px] text-gray-400 uppercase tracking-widest">
                  {d.toLocaleDateString("en-US", { weekday: "short" })}
                </div>
                <div className={`mt-1.5 mx-auto w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold
                  ${isToday ? "bg-[#440008] text-white" : "text-gray-600"}`}>
                  {d.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Time grid */}
        <div className="relative grid" style={{ gridTemplateColumns: "52px repeat(7, minmax(80px, 1fr))" }}>
          {/* Time labels */}
          <div className="relative select-none" style={{ height: TOTAL_HEIGHT }}>
            {timeLabels.map(({ h, label }) => (
              <div key={h} className="absolute right-2 text-[10px] text-gray-300 -translate-y-2.5"
                style={{ top: (h - HOUR_START) * HOUR_HEIGHT }}>
                {label}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((d, i) => {
            const ymd = dateKey(d);
            const isToday = ymd === todayYmd;
            const isPast = ymd < todayYmd;
            const dayBookings = bookingsByDate.get(ymd) || [];

            return (
              <div key={i}
                className={`relative border-l border-gray-100 ${isToday ? "bg-[#440008]/[0.015]" : ""}`}
                style={{ height: TOTAL_HEIGHT }}>

                {/* Hour lines */}
                {timeLabels.map(({ h }) => (
                  <div key={h} className="absolute w-full border-t border-gray-100"
                    style={{ top: (h - HOUR_START) * HOUR_HEIGHT }} />
                ))}

                {/* Bookings */}
                {dayBookings.map(b => {
                  const mins = parseTimeToMins(b.time);
                  if (mins === null) return null;
                  const topPx = (mins - HOUR_START * 60) / 60 * HOUR_HEIGHT;
                  if (topPx < 0 || topPx >= TOTAL_HEIGHT) return null;
                  const heightPx = Math.max(((b.duration || 60) / 60) * HOUR_HEIGHT - 4, 22);
                  const isHL = highlightId && b._id === highlightId;

                  return (
                    <button key={b._id}
                      onClick={() => setSelected(b)}
                      className={[
                        "absolute left-1 right-1 rounded-lg px-1.5 py-1 text-left text-white overflow-hidden transition hover:brightness-110 hover:shadow-md focus:outline-none",
                        isPast ? "bg-gray-400" : "bg-[#440008]",
                        isHL ? "ring-2 ring-yellow-400 ring-offset-1" : "",
                      ].join(" ")}
                      style={{ top: topPx + 2, height: heightPx, zIndex: 10 }}>
                      <div className="font-semibold text-[11px] leading-tight truncate">{b.name}</div>
                      {heightPx > 32 && <div className="text-[10px] opacity-75 truncate">{b.time}</div>}
                      {heightPx > 50 && <div className="text-[10px] opacity-60 truncate">{servicesText(b)}</div>}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
            onClick={e => e.stopPropagation()}>
            <div className="bg-[#440008] px-5 py-4 flex items-start justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm mb-2">
                  {getInitials(selected.name)}
                </div>
                <div className="text-white font-bold text-lg leading-tight">{selected.name}</div>
              </div>
              <button onClick={() => setSelected(null)} className="text-white/60 hover:text-white p-1 mt-1">
                <FaTimes />
              </button>
            </div>

            <div className="px-5 py-4 space-y-3">
              <a href={`tel:${selected.phone}`} className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#440008] group">
                <div className="w-7 h-7 rounded-full bg-[#440008]/10 flex items-center justify-center text-[#440008] group-hover:bg-[#440008] group-hover:text-white transition shrink-0">
                  <FaPhone size={10} />
                </div>
                {selected.phone || "No phone"}
              </a>
              <a href={`mailto:${selected.email}`} className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#440008] group">
                <div className="w-7 h-7 rounded-full bg-[#440008]/10 flex items-center justify-center text-[#440008] group-hover:bg-[#440008] group-hover:text-white transition shrink-0">
                  <FaEnvelope size={10} />
                </div>
                <span className="truncate">{selected.email || "No email"}</span>
              </a>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-7 h-7 rounded-full bg-[#440008]/10 flex items-center justify-center text-[#440008] shrink-0">
                  <FaCalendarAlt size={10} />
                </div>
                {selected.date} at {selected.time}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-7 h-7 rounded-full bg-[#440008]/10 flex items-center justify-center text-[#440008] shrink-0">
                  <FaClock size={10} />
                </div>
                {selected.duration || "?"} min
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-700">
                <div className="w-7 h-7 rounded-full bg-[#440008]/10 flex items-center justify-center text-[#440008] shrink-0 mt-0.5">
                  <FaCut size={10} />
                </div>
                <span>{servicesText(selected)}</span>
              </div>
              {selected.note && (
                <div className="ml-10 p-3 bg-[#F9F7F4] rounded-xl text-xs text-gray-500 leading-relaxed">
                  {selected.note}
                </div>
              )}
            </div>

            <div className="px-5 pb-5 flex gap-2">
              <button
                onClick={() => { onReschedule(selected); setSelected(null); }}
                className="flex-1 py-2.5 rounded-xl bg-[#440008]/5 text-[#440008] font-semibold text-sm border border-[#440008]/20 hover:bg-[#440008]/10 transition">
                Reschedule
              </button>
              <button
                onClick={() => { onCancel(selected._id); setSelected(null); }}
                className="flex-1 py-2.5 rounded-xl bg-red-50 text-red-600 font-semibold text-sm border border-red-200 hover:bg-red-100 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Booking Card (list view) ───────────────────────────────────────────────────

function BookingCard({ b, onCancel, onReschedule, onNoShow, onCheckout, isHighlighted }) {
  const status = normStatus(b?.status);
  const isCancelled = status === "cancelled";
  const isNoShow    = status === "noshow";
  const total       = getServiceTotal(b);
  const co          = b.checkout?.done ? b.checkout : null;

  return (
    <div
      id={`booking-${b._id}`}
      className={[
        "bg-white rounded-2xl border transition-all overflow-hidden",
        (isCancelled || isNoShow) ? "opacity-60 border-gray-200" : "border-[#440008]/15 hover:border-[#440008]/30 hover:shadow-sm",
        isHighlighted ? "ring-2 ring-[#440008] shadow-md" : "",
      ].join(" ")}
    >
      <div className="flex items-stretch">
        <div className={`w-1 shrink-0 ${isCancelled ? "bg-gray-200" : isNoShow ? "bg-orange-400" : "bg-[#440008]"}`} />
        <div className="flex-1 p-4">
          <div className="flex items-start gap-3">
            <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
              ${isCancelled ? "bg-gray-100 text-gray-400" : "bg-[#440008]/10 text-[#440008]"}`}>
              {getInitials(b.name)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-[#440008]">{b?.name?.trim() || "No name"}</span>
                {isCancelled && (
                  <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-red-100 text-red-400">
                    Cancelled
                  </span>
                )}
                {isNoShow && (
                  <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-orange-100 text-orange-500">
                    No-show
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                <a href={`tel:${b.phone}`} className="text-xs text-gray-400 hover:text-[#440008] transition">{b.phone || "No phone"}</a>
                <a href={`mailto:${b.email}`} className="text-xs text-gray-400 hover:text-[#440008] transition truncate max-w-[180px]">{b.email || "No email"}</a>
              </div>

              {!isCancelled && !isNoShow && (
                <div className="flex gap-2 flex-wrap mt-2.5">
                  <button onClick={() => onReschedule(b)}
                    className="text-xs font-semibold text-[#440008] border border-[#440008]/25 hover:bg-[#440008]/5 px-3 py-1.5 rounded-lg transition">
                    Reschedule
                  </button>
                  {onNoShow && (
                    <button onClick={() => onNoShow(b._id)}
                      className="text-xs font-semibold text-orange-500 border border-orange-200 hover:bg-orange-50 px-3 py-1.5 rounded-lg transition inline-flex items-center gap-1">
                      <FaUserSlash size={10} /> No-show
                    </button>
                  )}
                  <button onClick={() => onCancel(b._id)}
                    className="text-xs font-semibold text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1">
              <FaClock size={9} className="text-[#440008]" /> {formatTime(b)}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1">
              <FaClock size={9} className="text-gray-300" /> {b.duration || "?"} min
            </span>
            {total > 0 && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#440008] bg-[#440008]/5 border border-[#440008]/10 rounded-lg px-2.5 py-1">
                ${total}+
              </span>
            )}
          </div>

          <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
            <FaCut size={9} className="text-[#440008] shrink-0" />
            <span className="line-clamp-1">{servicesText(b)}</span>
          </div>

          {b.referredBy && (
            <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#440008] bg-[#440008]/5 border border-[#440008]/10 rounded-lg px-2.5 py-1">
              <FaUsers size={9} /> Referred by <span className="font-semibold">{b.referredBy}</span>
            </div>
          )}
          {b.note && (
            <div className="mt-2 text-xs text-gray-400 italic line-clamp-1">"{b.note}"</div>
          )}

          {/* Checkout row */}
          {!isCancelled && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              {co ? (
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="inline-flex items-center gap-1 font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-lg">
                      <FaCheckCircle size={9} /> Paid
                    </span>
                    {co.amount != null && <span className="text-gray-600 font-medium">${co.amount}</span>}
                    {co.tip > 0 && <span className="text-gray-400">+ ${co.tip} tip</span>}
                    {co.paymentMethod && (
                      <span className="text-gray-400 capitalize">{co.paymentMethod === "cash" ? "💵" : "💳"} {co.paymentMethod}</span>
                    )}
                    {co.stylist && <span className="text-gray-400">· {co.stylist}</span>}
                  </div>
                  <button onClick={() => onCheckout(b)}
                    className="text-xs text-[#440008]/50 hover:text-[#440008] border border-[#440008]/15 px-2.5 py-1 rounded-lg transition shrink-0">
                    Edit
                  </button>
                </div>
              ) : (
                !isNoShow && (
                  <button onClick={() => onCheckout(b)}
                    className="w-full py-2 rounded-xl bg-[#440008]/6 border border-[#440008]/20 text-[#440008] text-xs font-semibold hover:bg-[#440008]/10 transition inline-flex items-center justify-center gap-1.5">
                    <FaCheckCircle size={10} /> Checkout
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [tab, setTab]     = useState("upcoming");
  const [view, setView]   = useState("list");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [adminKey, setAdminKey] = useState(() => localStorage.getItem(ADMIN_KEY_STORAGE) || "");
  const [highlightId, setHighlightId] = useState(() => getQueryId());
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [checkoutTarget, setCheckoutTarget]     = useState(null);
  const [search, setSearch] = useState("");
  const [showManualBooking, setShowManualBooking] = useState(false);
  const [section, setSection]         = useState("today");
  const [settingsTab, setSettingsTab] = useState("credits");

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    const key = getAdminKey();
    setAdminKey(key);
    if (!key) { setErrorMsg("Admin key is required."); setLoading(false); return; }

    try {
      const res = await fetch(API_BASE, { headers: { "x-admin-key": key } });
      if (!res.ok) throw new Error(await parseError(res));
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid response");
      setBookings(data);

      const deepId = getQueryId();
      if (deepId) {
        const found = data.find(b => b?._id === deepId);
        if (found) {
          const st = normStatus(found?.status);
          if (st === "cancelled") setTab("cancelled");
          else setTab(getStartMs(found) < startOfTodayMs() ? "done" : "upcoming");
          setSection("bookings");
          setHighlightId(deepId);
          setTimeout(() => {
            document.getElementById(`booking-${deepId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 200);
          setTimeout(() => setHighlightId(""), 6000);
        }
      }
    } catch (err) {
      setBookings([]);
      setErrorMsg(err?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const cancelBooking = useCallback(async (id) => {
    const key = getAdminKey();
    if (!key) return;
    const b = bookings.find(b => b._id === id);
    if (!b || b.status === "cancelled") return;
    if (!window.confirm(`Cancel booking for ${b?.name || "this client"}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE", headers: { "x-admin-key": key } });
      if (!res.ok) throw new Error(await parseError(res));
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: "cancelled" } : b));
    } catch (err) {
      alert(err?.message || "Cancellation failed");
    }
  }, [bookings]);

  const rescheduleBooking = useCallback(async (id, date, time) => {
    const key = getAdminKey();
    if (!key) throw new Error("Admin key required");
    const res = await fetch(`${API_BASE}/${id}/reschedule`, {
      method: "PATCH",
      headers: { "x-admin-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({ date, time }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.error || "Reschedule failed");
    }
    setBookings(prev => prev.map(b => b._id === id ? { ...b, date, time } : b));
  }, []);

  const saveCheckout = useCallback(async (id, data) => {
    const key = getAdminKey();
    if (!key) throw new Error("Admin key required");
    const res = await fetch(`${API_BASE}/${id}/checkout`, {
      method: "PATCH",
      headers: { "x-admin-key": key, "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      throw new Error(d?.error || "Checkout failed");
    }
    const result = await res.json();
    setBookings(prev => prev.map(b => b._id === id ? { ...b, checkout: result.checkout } : b));
  }, []);

  const markNoShow = useCallback(async (id) => {
    const key = getAdminKey();
    if (!key) return;
    if (!window.confirm("Mark this booking as no-show?")) return;
    try {
      const res = await fetch(`${API_BASE}/${id}/noshow`, { method: "PATCH", headers: { "x-admin-key": key } });
      if (!res.ok) throw new Error(await parseError(res));
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: "noshow" } : b));
    } catch (err) {
      alert(err?.message || "Failed to mark no-show");
    }
  }, []);

  const clearKey = () => {
    localStorage.removeItem(ADMIN_KEY_STORAGE);
    setErrorMsg("Admin key cleared. Refresh to re-enter.");
  };

  const { grouped, counts } = useMemo(() => {
    const todayStart = startOfTodayMs();

    const normalized = bookings
      .map(b => ({ b, ms: getStartMs(b) }))
      .filter(x => x.ms !== Infinity);

    const upcoming  = normalized.filter(x => !["cancelled","noshow"].includes(normStatus(x.b?.status)) && x.ms >= todayStart).sort((a, b) => a.ms - b.ms);
    const done      = normalized.filter(x => !["cancelled","noshow"].includes(normStatus(x.b?.status)) && x.ms < todayStart).sort((a, b) => b.ms - a.ms);
    const noshow    = normalized.filter(x => normStatus(x.b?.status) === "noshow").sort((a, b) => b.ms - a.ms);
    const cancelled = normalized.filter(x => normStatus(x.b?.status) === "cancelled").sort((a, b) => b.ms - a.ms);

    const base = tab === "upcoming" ? upcoming : tab === "done" ? done : tab === "noshow" ? noshow : cancelled;
    const q = search.trim().toLowerCase();
    const selected = q ? base.filter(({ b }) =>
      b.name?.toLowerCase().includes(q) ||
      b.phone?.includes(q) ||
      b.email?.toLowerCase().includes(q) ||
      servicesText(b).toLowerCase().includes(q)
    ) : base;

    return {
      grouped: tab === "upcoming" ? groupByDate(selected) : groupByDate(selected).reverse(),
      counts: { upcoming: upcoming.length, done: done.length, noshow: noshow.length, cancelled: cancelled.length },
    };
  }, [bookings, tab, search]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F4] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-2 border-[#440008]/20 border-t-[#440008] animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading bookings…</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: "today",    label: "Today",    icon: FaCalendarAlt },
    { id: "bookings", label: "Bookings", icon: FaCalendarCheck },
    { id: "clients",  label: "Clients",  icon: FaUsers },
    { id: "settings", label: "Settings", icon: FaCog },
  ];

  const todayYmd        = ymdVancouver();
  const todayList       = bookings
    .filter(b => b.date === todayYmd && normStatus(b.status) !== "cancelled")
    .sort((a, b) => (parseTimeToMins(a.time) || 0) - (parseTimeToMins(b.time) || 0));
  const todayCheckedOut = todayList.filter(b => b.checkout?.done).length;
  const todayRevenue    = todayList.reduce((s, b) => s + getServiceTotal(b), 0);

  return (
    <div className="min-h-screen bg-[#F9F7F4] pb-24 sm:pb-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-20">

        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <h1 className="text-2xl font-theseason font-bold text-[#440008]">
            {section === "today"
              ? new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: SHOP_TZ })
              : section === "bookings" ? "All Bookings"
              : section === "clients"  ? "Clients"
              : "Settings"}
          </h1>
          <div className="flex items-center gap-2">
            <button onClick={fetchBookings} title="Refresh"
              className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-[#440008] transition">
              <FaSync size={14} />
            </button>
            <button onClick={() => setShowManualBooking(true)}
              className="px-4 py-2.5 rounded-xl bg-[#440008] text-white text-sm font-semibold inline-flex items-center gap-1.5 shadow-sm">
              <FaPlus size={11} /> New
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm">{errorMsg}</div>
        )}

        {/* Desktop section nav */}
        <div className="hidden sm:flex gap-1 mb-6 bg-white rounded-2xl p-1.5 border border-gray-100 shadow-sm">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setSection(id)}
              className={[
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition",
                section === id
                  ? "bg-[#440008] text-white shadow-sm"
                  : "text-gray-500 hover:text-[#440008] hover:bg-[#440008]/5",
              ].join(" ")}>
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>

        {/* ── TODAY ── */}
        {section === "today" && (
          <div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { value: todayList.length,    label: "Appointments" },
                { value: todayCheckedOut,      label: "Checked out" },
                { value: `$${todayRevenue}+`,  label: "Est. revenue" },
              ].map(({ value, label }) => (
                <div key={label} className="bg-white rounded-2xl p-4 text-center border border-gray-100 shadow-sm">
                  <div className="text-2xl font-bold text-[#440008]">{value}</div>
                  <div className="text-xs text-gray-400 mt-1">{label}</div>
                </div>
              ))}
            </div>

            {todayList.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <FaCalendarAlt size={28} className="mx-auto mb-3 text-gray-200" />
                <p className="text-gray-400 font-medium mb-4">No appointments today</p>
                <button onClick={() => setShowManualBooking(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#440008] text-white text-sm font-semibold inline-flex items-center gap-1.5">
                  <FaPlus size={10} /> Add Booking
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {todayList.map(b => (
                  <BookingCard key={b._id} b={b}
                    onCancel={cancelBooking} onReschedule={setRescheduleTarget}
                    onNoShow={markNoShow} onCheckout={setCheckoutTarget} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── BOOKINGS ── */}
        {section === "bookings" && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex gap-2 flex-wrap">
                {[
                  ["upcoming", "Upcoming",  counts.upcoming],
                  ["done",     "Done",      counts.done],
                  ["noshow",   "No-show",   counts.noshow],
                  ["cancelled","Cancelled", counts.cancelled],
                ].map(([id, label, count]) => (
                  <button key={id} onClick={() => setTab(id)}
                    className={[
                      "px-3 py-1.5 rounded-full text-xs font-semibold transition",
                      tab === id
                        ? "bg-[#440008] text-white shadow-sm"
                        : "bg-white text-gray-500 border border-gray-200 hover:border-[#440008]/30",
                    ].join(" ")}>
                    {label}{count > 0 ? ` (${count})` : ""}
                  </button>
                ))}
              </div>
              <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 gap-0.5 shrink-0">
                {[["list","List"],["calendar","Calendar"]].map(([v, label]) => (
                  <button key={v} onClick={() => setView(v)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      view === v ? "bg-[#440008] text-white shadow-sm" : "text-gray-400 hover:text-[#440008]"
                    }`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {view === "list" && (
              <div className="mb-4">
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name, phone, email, or service…"
                  className="w-full border border-[#440008]/20 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#440008]/20" />
              </div>
            )}

            {view === "calendar" ? (
              <CalendarView bookings={bookings} onCancel={cancelBooking} onReschedule={setRescheduleTarget} highlightId={highlightId} />
            ) : grouped.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <FaCalendarAlt size={28} className="mx-auto mb-3 text-gray-200" />
                <p className="text-sm text-gray-400">No bookings here.</p>
              </div>
            ) : (
              <div className="space-y-7">
                {grouped.map(day => (
                  <div key={day.dateLabel}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-bold uppercase tracking-widest text-[#440008]/60">{day.dateLabel}</span>
                      <div className="flex-1 h-px bg-[#440008]/10" />
                      <span className="text-xs text-gray-400">{day.list.length} booking{day.list.length !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="space-y-3">
                      {day.list.map(({ b }) => (
                        <BookingCard key={b._id} b={b}
                          onCancel={cancelBooking} onReschedule={setRescheduleTarget}
                          onNoShow={["upcoming","done"].includes(tab) ? markNoShow : null}
                          onCheckout={setCheckoutTarget}
                          isHighlighted={!!highlightId && b._id === highlightId} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── CLIENTS ── */}
        {section === "clients" && (
          <ClientsTab adminKey={adminKey} bookings={bookings} />
        )}

        {/* ── SETTINGS ── */}
        {section === "settings" && (
          <div>
            <div className="flex flex-wrap gap-2 mb-5">
              {[
                { id: "credits",  label: "Birthday Credits", icon: FaBirthdayCake },
                { id: "schedule", label: "Working Hours",    icon: FaCalendarAlt },
              ].map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setSettingsTab(id)}
                  className={[
                    "px-4 py-2 rounded-full text-sm font-semibold transition inline-flex items-center gap-2",
                    settingsTab === id
                      ? "bg-[#440008] text-white shadow-sm"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-[#440008]/30",
                  ].join(" ")}>
                  <Icon size={13} />{label}
                </button>
              ))}
              <button onClick={clearKey}
                className="px-4 py-2 rounded-full text-sm font-semibold bg-white text-gray-400 border border-gray-200 hover:border-red-300 hover:text-red-400 transition ml-auto">
                <FaKey size={12} className="mr-1.5" /> Reset Key
              </button>
            </div>
            {settingsTab === "credits" ? <CreditsTab adminKey={adminKey} /> : <ScheduleTab adminKey={adminKey} />}
          </div>
        )}

      </div>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 flex">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setSection(id)}
            className={`flex-1 flex flex-col items-center pt-3 pb-5 gap-0.5 transition ${
              section === id ? "text-[#440008]" : "text-gray-400"
            }`}>
            <Icon size={20} />
            <span className="text-[10px] font-semibold tracking-wide">{label}</span>
          </button>
        ))}
      </nav>

      {rescheduleTarget && (
        <RescheduleModal
          booking={rescheduleTarget}
          onClose={() => setRescheduleTarget(null)}
          onSave={rescheduleBooking}
        />
      )}

      {showManualBooking && (
        <ManualBookingModal
          onClose={() => setShowManualBooking(false)}
          onCreated={fetchBookings}
        />
      )}

      {checkoutTarget && (
        <CheckoutModal
          booking={checkoutTarget}
          onClose={() => setCheckoutTarget(null)}
          onSave={saveCheckout}
        />
      )}
    </div>
  );
}
