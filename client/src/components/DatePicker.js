// import React, { useState } from "react";
// import {
//   format,
//   addDays,
//   setHours,
//   setMinutes,
//   addMinutes,
//   isBefore,
// } from "date-fns";

// // Generate the next 10 days
// function generateNextDays(count = 10) {
//   const days = [];
//   for (let i = 0; i < count; i++) {
//     const date = addDays(new Date(), i);
//     days.push({
//       date,
//       day: format(date, "EEE"),
//       number: format(date, "d"),
//       full: format(date, "yyyy-MM-dd"),
//     });
//   }
//   return days;
// }

// // Generate available time slots (10 AM – 5 PM)
// function generateTimeSlots(duration = 60) {
//   const slots = [];
//   let start = setHours(setMinutes(new Date(), 0), 10);
//   const end = setHours(setMinutes(new Date(), 0), 21);

//   while (isBefore(addMinutes(start, duration), addMinutes(end, 1))) {
//     slots.push(format(start, "h:mm a"));
//     start = addMinutes(start, duration);
//   }

//   return slots;
// }

// export default function DateTimePicker({ onSelect, duration }) {
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedTime, setSelectedTime] = useState(null);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const dates = generateNextDays(10);

//   return (
//     <div className="space-y-6 bg-white/60 backdrop-blur-md rounded-[30px] shadow-2xl p-6 sm:p-8 max-w-2xl w-full mx-auto mt-20 sm:mt-28">
//       <h2 className="text-xl font-bold text-purplecolor tracking-wide text-center mb-2">
//         Choose a Date
//       </h2>

//       {/* Date Strip */}
//       <div className="flex gap-3 sm:gap-4 overflow-x-auto py-3 scrollbar-hide">
//         {dates.map((d) => (
//           <button
//             key={d.full}
//             aria-label={`Select ${d.day}, ${d.full}`}
//             onClick={() => setSelectedDate(d.date)}
//             className={`flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full border transition shrink-0 ${
//               selectedDate?.toDateString() === d.date.toDateString()
//                 ? "bg-purplecolor/80 text-white scale-105 shadow-md"
//                 : "bg-white text-purplecolor border-purplecolor/30 hover:translate-y-[-2px] hover:shadow-sm hover:scale-105"
//             }`}
//           >
//             <span className="text-xs sm:text-sm font-medium">{d.day}</span>
//             <span className="text-base sm:text-lg font-bold">{d.number}</span>
//           </button>
//         ))}
//       </div>

//       {/* Time selection */}
//       {selectedDate && (
//         <div>
//           <p className="text-center text-purplecolor font-semibold mb-3 mt-6">
//             Select a time:
//           </p>
//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
//             {generateTimeSlots(duration).map((time) => (
//               <button
//                 key={time}
//                 aria-label={`Select time ${time}`}
//                 onClick={() => {
//                   setSelectedTime(time);
//                   setShowConfirm(true);
//                 }}
//                 className={`w-full py-2 rounded-full border text-sm font-semibold transition duration-200 ${
//                   selectedTime === time
//                     ? "bg-purplecolor/80 text-white border-transparent scale-105 shadow-lg"
//                     : "bg-white text-purplecolor border-purplecolor/30 hover:bg-purplecolor hover:text-white hover:translate-y-[-2px]"
//                 }`}
//               >
//                 {time}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Confirmation Modal */}
//       {showConfirm && selectedDate && selectedTime && (
//         <div className="fixed inset-0 bg-purplecolor/60 flex items-center justify-center px-4 sm:px-8 z-50 transition-opacity duration-300 animate-fadeIn">
//           <div className="bg-white rounded-2xl p-5 sm:p-8 w-[90%] max-w-md shadow-xl text-center space-y-4">
//             <h3 className="text-lg font-semibold">Confirm Your Selection</h3>
//             <p className="text-sm text-gray-700">
//               You selected{" "}
//               <span className="font-medium text-purplecolor">
//                 {format(selectedDate, "PPP")}
//               </span>{" "}
//               at{" "}
//               <span className="font-medium text-purplecolor">
//                 {selectedTime}
//               </span>
//               .<br />
//               Is this correct?
//             </p>
//             <div className="flex justify-center gap-4 mt-4">
//               <button
//                 onClick={() => {
//                   onSelect({ date: selectedDate, time: selectedTime });
//                   setShowConfirm(false);
//                 }}
//                 className="px-4 py-2 bg-purplecolor text-white rounded-lg shadow hover:translate-y-[-2px] transition"
//               >
//                 Yes
//               </button>
//               <button
//                 onClick={() => setShowConfirm(false)}
//                 className="px-4 py-2 border border-purplecolor text-purplecolor rounded-lg hover:translate-y-[-2px] transition"
//               >
//                 No
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState } from "react";
import {
  format,
  isBefore,
  addMinutes,
  setHours,
  setMinutes,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns";

// Generate full calendar month
function generateMonthDates(year, month) {
  const start = startOfMonth(new Date(year, month));
  const end = endOfMonth(new Date(year, month));
  return eachDayOfInterval({ start, end }).map((date) => ({
    date,
    number: format(date, "d"),
    full: format(date, "yyyy-MM-dd"),
  }));
}

// Generate time slots
function generateTimeSlots(duration = 30, startHour = 10, endHour = 21) {
  const slots = [];
  let time = setHours(setMinutes(new Date(), 0), startHour);
  const end = setHours(setMinutes(new Date(), 0), endHour);

  while (isBefore(time, end)) {
    slots.push(format(time, "h:mm a"));
    time = addMinutes(time, duration);
  }

  return slots;
}

export default function DateTimePicker({ onSelect, duration = 30 }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const today = new Date();
  const monthDates = generateMonthDates(today.getFullYear(), today.getMonth());
  const timeSlots = generateTimeSlots(duration);

  return (
    <div className="space-y-6 bg-white/60 backdrop-blur-md rounded-[30px] shadow-2xl p-6 sm:p-8 max-w-2xl w-full mx-auto mt-20 sm:mt-28">
      <h2 className="text-xl font-bold text-purplecolor tracking-wide text-center mb-2">
        Choose a Date
      </h2>

      <h3 className="text-center text-lg font-bold text-purplecolor mt-4">
        {format(today, "MMMM yyyy")}
      </h3>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 sm:gap-4 justify-center py-4">
        {monthDates.map((d) => {
          const isToday = d.full === format(today, "yyyy-MM-dd");
          const isSelected =
            selectedDate?.toDateString() === d.date.toDateString();
          return (
            <button
              key={d.full}
              onClick={() => setSelectedDate(d.date)}
              className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full border font-semibold text-sm transition ${
                isSelected
                  ? "bg-purplecolor text-white shadow-md scale-105"
                  : isToday
                  ? "border-purplecolor text-purplecolor"
                  : "border-purplecolor/20 text-purplecolor/70 hover:border-purplecolor hover:bg-purplecolor/10"
              }`}
            >
              {d.number}
            </button>
          );
        })}
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div>
          <p className="text-center text-purplecolor font-semibold mb-3 mt-4">
            Select a time:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => {
                  setSelectedTime(time);
                  setShowConfirm(true);
                }}
                className={`w-full py-2 rounded-full border text-sm font-semibold transition duration-200 ${
                  selectedTime === time
                    ? "bg-purplecolor/80 text-white border-transparent scale-105 shadow-lg"
                    : "bg-white text-purplecolor border-purplecolor/30 hover:bg-purplecolor hover:text-white hover:translate-y-[-2px]"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && selectedDate && selectedTime && (
        <div className="fixed inset-0 rounded-3xl bg-purplecolor/60 flex items-center justify-center px-4 sm:px-8 z-50 transition-opacity duration-300 animate-fadeIn">
          <div className="bg-white rounded-2xl p-5 sm:p-8 w-[90%] max-w-md shadow-xl text-center space-y-4">
            <h3 className="text-lg font-semibold">Confirm Your Selection</h3>
            <p className="text-sm text-gray-700">
              You selected{" "}
              <span className="font-medium text-purplecolor">
                {format(selectedDate, "PPP")}
              </span>{" "}
              at{" "}
              <span className="font-medium text-purplecolor">
                {selectedTime}
              </span>
              .<br />
              Is this correct?
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => {
                  onSelect({ date: selectedDate, time: selectedTime });
                  setShowConfirm(false);
                }}
                className="px-4 py-2 bg-purplecolor text-white rounded-2xl shadow hover:translate-y-[-2px] transition"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border border-purplecolor text-purplecolor rounded-2xl hover:translate-y-[-2px] transition"
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
