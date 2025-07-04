import React, { useState } from "react";
import { format } from "date-fns";


const baseURL = process.env.REACT_APP_API_URL || "http://localhost:3000";


export default function QuestionsForm({ selection, bookingTime, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    referredBy: "",
    pregnant: "",
    blackHairHistory: "",
    allergies: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`${baseURL}/api/email/send-confirmation`, {
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


    onSubmit({
      ...form,
      services: selection.selected,
      total: selection.total,
      date: bookingTime.date,
      time: bookingTime.time,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-8 rounded-[25px] overflow-y-auto text-purplecolor"
    >
      <h2 className="text-2xl font-bold">Your Details</h2>

      <div>
        <label className="block text-md font-medium mb-1">Full Name *</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border border-purplecolor p-2 rounded"
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
          className="w-full border border-purplecolor p-2 rounded"
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
          className="w-full border border-purplecolor p-2 rounded"
        />
      </div>

      <h2 className="text-2xl font-bold">Additional Questions</h2>

      <div>
        <label className="block text-md font-medium mb-2">Did anyone refer you?</label>
        <div className="flex gap-6 mb-2">
          <label className="block text-sm font-medium mb-1">
            If someone referred you, please enter their name:
          </label>
          <input
            type="text"
            name="referredBy"
            placeholder="Full name of referrer"
            value={form.referredBy}
            onChange={handleChange}
            className="w-full border border-purplecolor p-2 rounded"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 w-full py-3 bg-purplecolor text-white rounded-lg font-bold"
      >
        Submit Booking
      </button>
    </form>
  );
}
