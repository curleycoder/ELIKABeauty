import React, { useMemo, useState } from "react";

const SHOP_TZ = "America/Vancouver";

// generate times 10:00–18:30 every 30 min
function buildTimes() {
  const times = [];
  for (let h = 10; h <= 18; h++) {
    for (const m of [0, 30]) {
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      times.push(`${hh}:${mm}`);
    }
  }
  return times;
}

export default function SimpleDateTimePicker({ onSelect }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const times = useMemo(() => buildTimes(), []);

  const canSelect = Boolean(date && time);

  return (
    <div className="bg-white rounded-2xl shadow p-5 border border-pink-100">
      <h3 className="text-lg font-bold text-[#7a3b44] mb-3">Pick a date & time</h3>

      <label className="block text-sm text-gray-600 mb-1">Date</label>
      <input
        type="date"
        value={date}
        onChange={(e) => {
          setDate(e.target.value);
          setTime("");
        }}
        className="w-full border rounded-lg px-3 py-2 mb-4"
      />

      <label className="block text-sm text-gray-600 mb-1">Time</label>
      <select
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="w-full border rounded-lg px-3 py-2"
        disabled={!date}
      >
        <option value="">Select a time</option>
        {times.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <button
        type="button"
        disabled={!canSelect}
        onClick={() => {
          // Keep it simple: store what your backend can consume easily.
          // Backend accepts "HH:MM" and date "YYYY-MM-DD"
          onSelect({ date, time });
        }}
        className={`mt-4 w-full px-4 py-2 rounded-full font-bold text-white ${
          canSelect ? "bg-[#55203d]" : "bg-[#7a3b44]/25 cursor-not-allowed"
        }`}
      >
        Confirm time
      </button>

      <p className="text-xs text-gray-500 mt-3">
        Times shown in {SHOP_TZ}.
      </p>
    </div>
  );
}
