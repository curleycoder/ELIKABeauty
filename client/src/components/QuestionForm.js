import React, { useState } from "react";
import { format } from "date-fns";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:3000";

export default function QuestionsForm({ selection, bookingTime, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    referredBy: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(`${baseURL}/api/email/send-confirmation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        services: selection.selected,
        date: format(bookingTime.date, "PPP"),
        time: bookingTime.time,
      }),
    });

    if (!response.ok) {
      throw new Error("❌ Failed to send confirmation email.");
    }

    // ✅ Trigger popup via parent
    onSubmit({
      ...form,
      services: selection.selected,
      total: selection.total,
      date: bookingTime.date,
      time: bookingTime.time,
    });

  } catch (error) {
    console.error("❌ Error submitting booking:", error);
    alert("Failed to submit booking. Please try again.");
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
        className="mt-6 w-full py-3 bg-purplecolor text-white rounded-full font-bold text-lg hover:brightness-110 transition"
      >
        Submit Booking
      </button>
    </form>
  );
}
