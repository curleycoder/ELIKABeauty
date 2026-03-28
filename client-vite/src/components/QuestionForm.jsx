import React, { useEffect, useRef, useState, useCallback } from "react";
import { ClipLoader } from "react-spinners";
import { FaCheckCircle, FaLock } from "react-icons/fa";

const baseURL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
if (!baseURL) console.error("Missing VITE_API_URL");

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function normalizePhone(p) {
  return String(p || "").replace(/[^\d+]/g, "");
}

export default function QuestionsForm({
  selection,
  bookingTime,
  onTimeConflict,
  onSubmit,
  setLoading,
  loading,
  submitSignal,
  hideSubmitButton = false,
}) {
  const formRef = useRef(null);
  const submittingRef = useRef(false);
  const lastSignalRef = useRef(0);
  const lookupTimerRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    referredBy: "",
    birthdayMonth: "",
    birthdayDay: "",
    note: "",
  });

  // Client profile state
  const [returning, setReturning] = useState(false);       // found in DB
  const [birthdayLocked, setBirthdayLocked] = useState(false); // already has birthday on file
  const [lookupStatus, setLookupStatus] = useState("idle"); // idle | loading | done

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Phone field — debounce lookup 600ms after user stops typing
  const handlePhoneChange = (e) => {
    const val = e.target.value;
    setForm((prev) => ({ ...prev, phone: val }));

    clearTimeout(lookupTimerRef.current);
    setReturning(false);
    setBirthdayLocked(false);
    setLookupStatus("idle");

    const normalized = normalizePhone(val);
    if (normalized.length < 10) return;

    lookupTimerRef.current = setTimeout(() => lookupClient(normalized), 600);
  };

  const lookupClient = async (phone) => {
    setLookupStatus("loading");
    try {
      const res = await fetch(`${baseURL}/api/clients/lookup?phone=${encodeURIComponent(phone)}`);
      if (!res.ok) return;
      const data = await res.json();

      if (data.found) {
        setReturning(true);
        setBirthdayLocked(data.hasBirthday);
        setForm((prev) => ({
          ...prev,
          name: data.name || prev.name,
          email: data.email || prev.email,
          referredBy: data.referredBy || prev.referredBy,
          // clear birthday fields if already locked on server
          birthdayMonth: data.hasBirthday ? "" : prev.birthdayMonth,
          birthdayDay: data.hasBirthday ? "" : prev.birthdayDay,
        }));
      }
      setLookupStatus("done");
    } catch {
      setLookupStatus("idle");
    }
  };

  const triggerSubmit = useCallback(() => {
    if (loading) return;
    if (submittingRef.current) return;
    formRef.current?.requestSubmit?.();
  }, [loading]);

  useEffect(() => {
    if (!submitSignal) return;
    if (submitSignal === lastSignalRef.current) return;
    lastSignalRef.current = submitSignal;
    triggerSubmit();
  }, [submitSignal, triggerSubmit]);

  const readResponseBody = async (res) => {
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      try { return await res.json(); } catch { return null; }
    }
    try { return await res.text(); } catch { return ""; }
  };

  const assertOk = async (res, label) => {
    if (res.ok) return;
    const body = await readResponseBody(res);
    const msg =
      (body && typeof body === "object" && (body.error || body.message)) ||
      (typeof body === "string" && body) ||
      `${label} failed (${res.status})`;
    throw new Error(msg);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    setLoading(true);

    try {
      if (!bookingTime?.date || !bookingTime?.time)
        throw new Error("Please select a date and time.");
      if (!selection?.selected?.length)
        throw new Error("Please select at least one service.");

      const bookingPayload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        referredBy: form.referredBy.trim(),
        services: selection.selected.map((s) => s._id),
        date: bookingTime.date,
        time: bookingTime.time,
        note: (form.note || "").trim(),
        // only send birthday if not locked
        birthdayMonth: !birthdayLocked && form.birthdayMonth ? Number(form.birthdayMonth) : null,
        birthdayDay: !birthdayLocked && form.birthdayDay ? Number(form.birthdayDay) : null,
      };

      const res = await fetch(`${baseURL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });

      await assertOk(res, "BOOKING");
      const saved = await res.json();

      onSubmit({
        savedBooking: saved,
        displayBooking: {
          ...form,
          services: selection.selected,
          total: selection.total,
          date: bookingTime.date,
          time: bookingTime.time,
        },
      });
    } catch (error) {
      console.error("Error submitting booking:", error);
      const msg = String(error?.message || "");
      if (msg.toLowerCase().includes("no longer available")) {
        alert("That time just got booked. Please choose another time.");
        onTimeConflict?.();
      } else {
        alert(msg || "Failed. Try again.");
      }
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  };

  const inputCls = "w-full border border-[#572a31]/30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#572a31]";
  const lockedCls = "w-full border border-[#572a31]/10 p-3 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed";

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-6 bg-white/90 p-6 sm:p-8 rounded-[25px] shadow-xl text-[#572a31] w-full max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-display font-bold mb-2">Your Details</h2>

      {/* Phone first — triggers lookup */}
      <div>
        <label className="block text-md font-display font-medium mb-1">
          Phone Number *
        </label>
        <div className="relative">
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handlePhoneChange}
            required
            autoComplete="tel"
            inputMode="tel"
            placeholder="e.g. 604-555-1234"
            className={inputCls}
          />
          {lookupStatus === "loading" && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              <ClipLoader size={16} color="#572a31" />
            </span>
          )}
        </div>

        {returning && (
          <p className="mt-1.5 text-sm text-green-700 flex items-center gap-1.5">
            <FaCheckCircle /> Welcome back! Your details have been pre-filled.
          </p>
        )}
      </div>

      <div>
        <label className="block text-md font-display font-medium mb-1">Full Name *</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          autoComplete="name"
          placeholder="Full name"
          className={inputCls}
        />
      </div>

      <div>
        <label className="block text-md font-display font-medium mb-1">Email Address *</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          className={inputCls}
        />
      </div>

      <h2 className="text-2xl font-bold font-display pt-6">Additional Questions</h2>

      <div>
        <label className="block text-md font-display font-medium mb-2">Did someone refer you?</label>
        <input
          type="text"
          name="referredBy"
          placeholder="Full name of the person who referred you"
          value={form.referredBy}
          onChange={handleChange}
          className={inputCls}
        />
      </div>

      {/* Birthday — hidden if already locked on server */}
      {birthdayLocked ? (
        <div className="rounded-xl border border-[#572a31]/10 bg-[#fdf8f8] p-4 flex items-center gap-3 text-sm text-[#572a31]/60">
          <FaLock />
          Birthday already saved — you'll get your gift automatically every year.
        </div>
      ) : (
        <div>
          <label className="block text-md font-display font-medium mb-2">
            Birthday{" "}
            <span className="text-sm font-normal text-gray-400">
              (optional — get a $20 gift on your birthday!)
            </span>
          </label>
          <div className="flex gap-3">
            <select
              name="birthdayMonth"
              value={form.birthdayMonth}
              onChange={handleChange}
              className={`w-1/2 ${inputCls} bg-white`}
            >
              <option value="">Month</option>
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>
            <select
              name="birthdayDay"
              value={form.birthdayDay}
              onChange={handleChange}
              className={`w-1/2 ${inputCls} bg-white`}
            >
              <option value="">Day</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div>
        <label className="block text-md font-display font-medium mb-2">Note (optional)</label>
        <textarea
          name="note"
          value={form.note}
          onChange={handleChange}
          rows={3}
          className={inputCls}
        />
      </div>

      {!hideSubmitButton && (
        <button
          type="button"
          onClick={triggerSubmit}
          disabled={loading}
          className={`mt-6 w-full py-3 font-display rounded-full font-bold text-lg flex justify-center items-center gap-2 transition ${
            loading
              ? "bg-[#572a31]/60 cursor-wait text-white"
              : "bg-[#572a31] text-white hover:brightness-110"
          }`}
        >
          {loading ? (
            <><ClipLoader color="#fff" size={22} /> Submitting...</>
          ) : (
            "Submit Booking"
          )}
        </button>
      )}
    </form>
  );
}
