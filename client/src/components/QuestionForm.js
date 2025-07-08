import React, { useState } from "react";
import { format } from "date-fns";
import {ClipLoader } from "react-spinners"

const baseURL =
  process.env.REACT_APP_API_URL || "https://api.beautyshohrestudio.ca";


export default function QuestionsForm({ selection, bookingTime, onSubmit, setLoading, loading }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    referredBy: "",
    note: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true)

  if (!bookingTime?.date || !bookingTime?.time) {
  alert("Please select a date and time.");
  setLoading(false); // <-- add this
  return;
}


  const bookingPayload = {
    name: form.name,
    email: form.email,
    phone: form.phone,
    referredBy: form.referredBy,
    services: selection.selected.map((s) => s._id),
    date: bookingTime.date,
    time: bookingTime.time,
    note: form.note || "",
  };

  try {
    // 1. Save booking to MongoDB
    const dbRes = await fetch(`${baseURL}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingPayload),
    });

    if (!dbRes.ok) {
      throw new Error("Failed to save booking to database.");
    }

    // 2. Send confirmation email
    const emailRes = await fetch(`${baseURL}/api/email/send-confirmation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        services: selection.selected.map((s) => s.name),
        date: bookingTime.date,
        time: bookingTime.time,
        duration: selection.duration,
        note: form.note || "",
      }),
    });

    if (!emailRes.ok) {
      throw new Error("Failed to send confirmation email.");
    }

    // 3. Notify parent of success
    onSubmit({
      ...form,
      services: selection.selected,
      total: selection.total,
      date: bookingTime.date,
      time: bookingTime.time,
    });

  } catch (error) {
    console.error("❌ Error submitting booking:", error);
    alert("❌ Failed to complete booking. Please try again.");
  } finally{
    setLoading(false)
  }
};




  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white/90 p-6 sm:p-8 rounded-[25px] shadow-xl overflow-y-auto text-purplecolor w-full max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-2">Your Details</h2>

      {/* Name */}
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

      {/* Email */}
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

      {/* Phone */}
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

      {/* Referred By */}
      <div>
        <label className="block text-md font-medium mb-2">
          Did someone refer you?
        </label>
        <input
          type="text"
          name="referredBy"
          placeholder="Full name of the person who referred you"
          value={form.referredBy}
          onChange={handleChange}
          className="w-full border border-purplecolor/30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purplecolor"
        />
      </div>

      {/* Submit */}
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
