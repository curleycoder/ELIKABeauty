import React, { useState } from "react";
import { ClipLoader } from "react-spinners";

const baseURL =
  process.env.REACT_APP_API_URL || "https://api.beautyshohrestudio.ca";

export default function QuestionsForm({
  selection,
  bookingTime,
  onSubmit,
  setLoading,
  loading,
}) {
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
    setLoading(true);

    try {
      // Hard validation
      if (!bookingTime?.date || !bookingTime?.time) {
        throw new Error("Please select a date and time.");
      }
      if (!selection?.selected?.length) {
        throw new Error("Please select at least one service.");
      }

      // 1) Save booking to MongoDB
      const bookingPayload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        referredBy: form.referredBy.trim(),
        services: selection.selected.map((s) => s._id),
        date: bookingTime.date, // keep same shape backend expects
        time: bookingTime.time, // "h:mm a" e.g. "3:00 PM"
        note: (form.note || "").trim(),
      };

      const dbRes = await fetch(`${baseURL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });

      await assertOk(dbRes, "BOOKING");

      // 2) Send confirmation email (NON-BLOCKING)
      let emailOk = true;

      const emailPayload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        referredBy: form.referredBy.trim(),
        services: selection.selected.map((s) => s.name),
        date: bookingTime.date,
        time: bookingTime.time,
        duration: selection.duration ?? null,
        note: (form.note || "").trim(),
      };

      try {
        const emailRes = await fetch(`${baseURL}/api/email/send-confirmation`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(emailPayload),
        });

        if (!emailRes.ok) {
          emailOk = false;
          const body = await readResponseBody(emailRes);
          console.error("❌ EMAIL FAILED (non-blocking)", {
            url: emailRes.url,
            status: emailRes.status,
            statusText: emailRes.statusText,
            body,
          });
        }
      } catch (err) {
        emailOk = false;
        console.error("❌ EMAIL FAILED (network, non-blocking)", err);
      }

      // 3) Notify parent of success (ALWAYS if booking saved)
      onSubmit({
        ...form,
        services: selection.selected,
        total: selection.total,
        date: bookingTime.date,
        time: bookingTime.time,
      });

      // Optional: warn about email only (don’t scare them with “failed booking”)
      if (!emailOk) {
        alert(
          "✅ Booking confirmed. ⚠️ Email didn’t send right now. If you don’t receive it, we’ll still have your appointment saved."
        );
      }
    } catch (error) {
      console.error("❌ Error submitting booking:", error);
      alert(`❌ ${error.message || "Failed to complete booking. Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white/90 p-6 sm:p-8 rounded-[25px] shadow-xl overflow-y-auto text-purplecolor w-full max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-2">Your Details</h2>

      <div>
        <label className="block text-md font-medium mb-1">Full Name *</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border border-purplecolor/30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purplecolor"
        />
      </div>

      <div>
        <label className="block text-md font-medium mb-1">Email Address *</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border border-purplecolor/30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purplecolor"
        />
      </div>

      <div>
        <label className="block text-md font-medium mb-1">Phone Number *</label>
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          className="w-full border border-purplecolor/30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purplecolor"
        />
      </div>

      <h2 className="text-2xl font-bold pt-6">Additional Questions</h2>

      <div>
        <label className="block text-md font-medium mb-2">Did someone refer you?</label>
        <input
          type="text"
          name="referredBy"
          placeholder="Full name of the person who referred you"
          value={form.referredBy}
          onChange={handleChange}
          className="w-full border border-purplecolor/30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purplecolor"
        />
      </div>

      <div>
        <label className="block text-md font-medium mb-2">Note (optional)</label>
        <textarea
          name="note"
          value={form.note}
          onChange={handleChange}
          rows={3}
          className="w-full border border-purplecolor/30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purplecolor"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`mt-6 w-full py-3 rounded-full font-bold text-lg flex justify-center items-center gap-2 transition ${
          loading
            ? "bg-purplecolor/60 cursor-wait text-white"
            : "bg-purplecolor text-white hover:brightness-110"
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
