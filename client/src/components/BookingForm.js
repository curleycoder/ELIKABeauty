import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import services from "../data/services";


export default function BookingForm({ onSelectionChange }) {
  const [selected, setSelected] = useState([]);
  const [activeTab, setActiveTab] = useState("Featured");

const tabs = ["Featured", "Hair", "Face", "Add-ons", "Men"];


  const handleSelect = (name) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const total = selected.reduce((sum, name) => {
    const s = services.find((s) => s.name === name);
    return sum + (s?.price || 0);
  }, 0);

  // Notify parent (Booking.jsx) when selection or total changes
  useEffect(() => {
    onSelectionChange?.({ selected, total });
  }, [selected, total, onSelectionChange]);

  return (
    <div className="space-y-6 font-bodonimoda">
      <h2 className="mb-12 px-6 py-3 text-2xl font-bold text-purplecolor bg-white/80 rounded-full shadow-md drop-shadow-[0_0_6px_rgba(255,255,255,0.6)] w-fit tracking-wide">
        Services
      </h2>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full font-bold text-sm transition ${
              activeTab === tab
                ? "bg-purplecolor text-white shadow scale-110" 
                : " bg-white text-purplecolor hover:translate-y-[-2px]"
            }`}

          >
            {tab}
          </button>
        ))}
      </div>


      {/* Service Cards */}
      <div className="space-y-4 overflow-y-auto pr-2" style={{ flex: 1, minHeight: 0 }}>
    {services.map((s, index) => (
      <div
        key={index + s.name}
        className="bg-white rounded-[20px] shadow p-6 flex justify-between items-center"
      >
        <p className="font-medium text-lg">{s.name}</p>
        <button
          onClick={() => handleSelect(s.name)}
          className="p-2 rounded-full border hover:bg-purplecolor hover:text-white"
        >
          <FaPlus />
        </button>
      </div>
    ))}
  </div>

    </div>
  );
}
