import React, { useEffect, useRef, useState } from "react";
import { ClipLoader } from "react-spinners";

const baseURL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
if (!baseURL) {
  console.error("Missing VITE_API_URL");
}


export default function QuestionsForm({
  selection,
  bookingTime,
  onSubmit,
  setLoading,
  loading,
  submitSignal, // ✅ NEW: stepper Confirm triggers this
}) {
  const formRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    referredBy: "",
    note: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ✅ Stepper Confirm -> triggers native form submission
  useEffect(() => {
    if (!submitSignal) return;
    if (loading) return;

    // Native HTML validation + submit event
    formRef.current?.requestSubmit?.();
  }, [submitSignal, loading]);

  // Reads server error responses safely (json OR text)
  const readResponseBody = async (res) => {
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      try {
        return await res.json();
      } catch {
        return null;
      }
    }
    try {
      return await res.text();
    } catch {
      return "";
    }
  };

  // Throws a useful error with status + body
  const assertOk = async (res, label) => {
    if (res.ok) return;
    const body = await readResponseBody(res);

    console.error(`❌ ${label} FAILED`, {
      url: res.url,
      status: res.status,
      statusText: res.statusText,
      body,
    });

    const msg =
      (body && typeof body === "object" && (body.error || body.message)) ||
      (typeof body === "string" && body) ||
      `${label} failed (${res.status})`;

    throw new Error(msg);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      if (!bookingTime?.date || !bookingTime?.time) {
        throw new Error("Please select a date and time.");
      }
      if (!selection?.selected?.length) {
        throw new Error("Please select at least one service.");
      }

      const bookingPayload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        referredBy: form.referredBy.trim(),
        services: selection.selected.map((s) => s._id),
        date: bookingTime.date,
        time: bookingTime.time,
        note: (form.note || "").trim(),
      };

      const dbRes = await fetch(`${baseURL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });

      await assertOk(dbRes, "BOOKING");

      // Booking saved (backend will send emails)
      onSubmit({
        ...form,
        services: selection.selected,
        total: selection.total,
        date: bookingTime.date,
        time: bookingTime.time,
      });
    } catch (error) {
      console.error("❌ Error submitting booking:", error);

      if (String(error.message).includes("no longer available")) {
        alert("That time just got booked. Please choose another time.");
      } else {
        alert(`❌ ${error.message || "Failed. Try again."}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      // ❌ removed overflow-y-auto (nested scroll killer)
      className="space-y-6 bg-white/90 p-6 sm:p-8 rounded-[25px] shadow-xl text-[#572a31] w-full max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-display font-bold mb-2">Your Details</h2>

      <div>
        <label className="block text-md font-display font-medium mb-1">
          Full Name *
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          autoComplete="name"
          placeholder="Full name"
          className="w-full border border-[#572a31]/30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#572a31]"
        />
      </div>

      <div>
        <label className="block text-md font-display font-medium mb-1">
          Email Address *
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          className="w-full border border-[#572a31]/30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#572a31]"
        />
      </div>

      <div>
        <label className="block text-md font-display font-medium mb-1">
          Phone Number *
        </label>
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          autoComplete="tel"
          inputMode="tel"
          placeholder="e.g. 604-555-1234"
          className="w-full border border-[#572a31]/30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#572a31]"
        />
      </div>

      <h2 className="text-2xl font-bold font-display pt-6">
        Additional Questions
      </h2>

      <div>
        <label className="block text-md font-display font-medium mb-2">
          Did someone refer you?
        </label>
        <input
          type="text"
          name="referredBy"
          placeholder="Full name of the person who referred you"
          value={form.referredBy}
          onChange={handleChange}
          className="w-full border border-[#572a31]/30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#572a31]"
        />
      </div>

      <div>
        <label className="block text-md font-display font-medium mb-2">
          Note (optional)
        </label>
        <textarea
          name="note"
          value={form.note}
          onChange={handleChange}
          rows={3}
          className="w-full border border-[#572a31]/30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#572a31]"
        />
      </div>

      {/* Optional: keep this button for accessibility / keyboard users.
          The stepper Confirm will also submit via requestSubmit(). */}
      <button
        type="submit"
        disabled={loading}
        className={`mt-6 w-full py-3 font-display rounded-full font-bold text-lg flex justify-center items-center gap-2 transition ${
          loading
            ? "bg-[#572a31]/60 cursor-wait text-white"
            : "bg-[#572a31] text-white hover:brightness-110"
        }`}
      >
        {loading ? (
          <>
            <ClipLoader color="#fff" size={22} />
            Submitting...
          </>
        ) : (
          "Submit Booking"
        )}
      </button>
    </form>
  );
}
