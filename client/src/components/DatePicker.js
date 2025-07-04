// DateTimePicker.js
import React, { useState } from "react";
import { format, addDays, setHours, setMinutes, addMinutes, isBefore } from "date-fns";

function generateNextDays(count = 10) {
  const days = [];
  for (let i = 0; i < count; i++) {
    const date = addDays(new Date(), i);
    days.push({
      date,
      day: format(date, "EEE"),
      number: format(date, "d"),
      full: format(date, "yyyy-MM-dd"),
    });
  }
  return days;
}

function generateTimeSlots(duration = 60) {
  const slots = [];
  let start = setHours(setMinutes(new Date(), 0), 10); // 10 AM
  const end = setHours(setMinutes(new Date(), 0), 17); // 5 PM

  while (isBefore(addMinutes(start, duration), addMinutes(end, 1))) {
    slots.push(format(start, "h:mm a"));
    start = addMinutes(start, duration);
  }

  return slots;
}

export default function DateTimePicker({ onSelect, duration }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const dates = generateNextDays(10);

  return (
    <div className="space-y-6 bg-white/60 backdrop-blur-md rounded-[30px] shadow-2xl p-8 max-w-2xl w-full mx-auto mt-28">
      <h2 className="text-xl font-bold text-purplecolor tracking-wide text-center mb-2">
        Choose a Date
      </h2>

      <div className="flex gap-4 overflow-x-auto py-3 scrollbar-hide">
        {dates.map((d) => (
          <button
            key={d.full}
            onClick={() => setSelectedDate(d.date)}
            className={`flex flex-col items-center justify-center w-20 h-20 rounded-full border transition shrink-0 ${
              selectedDate?.toDateString() === d.date.toDateString()
                ? "bg-purplecolor/80 text-white scale-110"
                : "bg-white text-purplecolor border-purplecolor/30 hover:translate-y-[-2px] hover:shadow-[0_0_6px_rgba(128,0,128,0.25)] hover:scale-105"
            }`}
          >
            <span className="text-sm font-medium">{d.day}</span>
            <span className="text-lg font-bold">{d.number}</span>
          </button>
        ))}
      </div>

      {selectedDate && (
        <div>
          <p className="text-center text-purplecolor z-[9999] font-semibold mb-3 mt-6">Select a time:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {generateTimeSlots(duration).map((time) => (
              <button
                key={time}
                onClick={() => {
                  setSelectedTime(time);
                  setShowConfirm(true);
                }}
                className={`w-full py-2 rounded-full border text-sm font-semibold transition duration-200 ${
                  selectedTime === time
                    ? "bg-purplecolor/80 text-white border-transparent scale-110 shadow-lg"
                    : "bg-white text-purplecolor border-purplecolor/30 hover:bg-purplecolor hover:text-white hover:translate-y-[-2px]"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      {showConfirm && selectedDate && selectedTime && (
        <div className="fixed inset-0 bg-purplecolor/60 rounded-[25px] flex items-center justify-center px-4 sm:px-8 z-50">
          <div className="bg-white rounded-xl p-5 sm:p-8 w-[90%] max-w-md shadow-xl text-center space-y-4">
            <h3 className="text-lg font-semibold">Confirm Your Selection</h3>
            <p className="text-sm text-gray-700">
              You selected <span className="font-medium text-purplecolor">{format(selectedDate, "PPP")}</span> at {" "}
              <span className="font-medium text-purplecolor">{selectedTime}</span>.<br />
              Is this correct?
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => {
                  onSelect({ date: selectedDate, time: selectedTime });
                  setShowConfirm(false);
                }}
                className="px-4 py-2 bg-purplecolor text-white rounded-lg shadow hover:translate-y-[-2px]"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border border-purplecolor text-purplecolor rounded-lg hover:translate-y-[-2px]"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
