import React, { useState, useEffect } from "react";
import { FaPlus, FaCheck } from "react-icons/fa";

export default function BookingForm({ onSelectionChange, averageDuration, onContinue }) {
  const [selected, setSelected] = useState([]);
  const [activeTab, setActiveTab] = useState("Hair");
  const [conflictWarning, setConflictWarning] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const [services, setServices] = useState([]);

  const baseURL = process.env.REACT_APP_API_URL || "";


  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${baseURL}/api/services`);
        // const response = await fetch("https://api.beautyshohrestudio.ca/api/services");

        const data = await response.json();
        setServices(data);
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };
    fetchServices();
  }, []);


    const tabs = ["Hair", "Face", "Men", "Add-ons"];


    const total = selected.reduce((sum, s) => sum + (s?.price || 0), 0);

  useEffect(() => {
    onSelectionChange?.({ selected, total });
  }, [selected, total, onSelectionChange]);


  useEffect(() => {
    const hasKeratin = selected.some((s)=> s.name === "Keratin");
    const conflicting = ["Highlight", "Balayage", "Hair Color"];
    const hasConflict = selected.some((s) => conflicting.includes(s.name));
    setConflictWarning(hasKeratin && hasConflict);
  }, [selected]);


  const handleSelect = (service) => {
  const alreadySelected = selected.find((s) => s._id === service._id);
  if (alreadySelected) {
    setSelected((prev) => prev.filter((s) => s._id !== service._id));
  } else {
    setSelected((prev) => [...prev, service]);
  }
};

  return (
    <div className="space-y-6 font-bodonimoda px-4 pb-28">
      <div className="text-center">
        <h2 className="text-3xl text-purplecolor mb-6">
          <span className="border-t border-b border-gray-300 px-6">Services</span>
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-full font-semibold text-sm transition-all ${
              activeTab === tab
                ? "bg-purplecolor text-white shadow-md scale-105"
                : "bg-gray-100 text-purplecolor hover:translate-y-[-2px]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Warning */}
      {conflictWarning && (
        <div className="transition-opacity duration-300 ease-in-out opacity-100 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">⚠️ Warning:</strong>
          <span className="block sm:inline ml-2">
            These two services can't be done in one day. We care about the health of your hair 💜
          </span>
        </div>
      )}

      {/* Services List */}
      <div className="space-y-4 overflow-y-auto">
        {services
          .filter((s) => s.category === activeTab)
          .map((s, index) => (
            <div
              key={s._id || index}
              className={`bg-white rounded-xl shadow p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 ${
                selected.some(sel => sel._id === s._id) ? "border-2 border-purplecolor" : ""
              }`}
            >
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900">{s.name}</h3>
                <div className="text-sm text-gray-600 mt-1">
                  
                  <span className="block">
                    ${s.price}
                    {s.fromPrice && <span className="text-xs text-gray-400 ml-0.5 align-top">+</span>}
                  </span>

                  <span className="block truncate">{s.description}</span>
                </div>
              </div>

              <div className="sm:self-end sm:ml-4">
                <button
                  onClick={() => handleSelect(s)}
                  className={`mt-2 sm:mt-0 p-2 border rounded-full transition ${
                    selected.some((sel) => sel._id === s._id)

                      ? "bg-purplecolor text-white border-purplecolor"
                      : "text-purplecolor hover:bg-purplecolor hover:text-white"
                  }`}
                >
                  {selected.some(sel => sel._id === s._id ) ? <FaCheck /> : <FaPlus />}
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Sticky Bar */}
      {selected.length > 0 && (
        <>
          <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow z-50 p-4 sm:hidden">
            <div className="flex justify-between items-center text-purplecolor font-semibold text-lg">
              <div>
                {selected.length} service{selected.length > 1 ? "s" : ""} • ${total}
              </div>
              <button onClick={() => setShowDetails(!showDetails)}>
                {showDetails ? "▲" : "▼"}
              </button>
            </div>
          </div>

          {/* Expandable Detail Box */}
          {showDetails && (
            <div className="fixed bottom-16 left-0 w-full px-4 sm:hidden z-40">
              <div className="bg-white rounded-t-2xl shadow-lg p-4 border">
                <h3 className="font-bold text-purplecolor mb-3">Selected Services</h3>
                <ul className="space-y-2 max-h-48 overflow-y-auto text-sm">
                  {selected?.length > 0 &&
                    selected.map((s, i) => {
                      if (!s || typeof s.name !== "string" || typeof s.price !== "number") return null;
                      return (
                        <li key={s._id || i} className="flex justify-between">
                          <span>{s.name}</span>
                          <span>${s.price}</span>
                        </li>
                      );
                    })}
                </ul>

                                              
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>Time on Service</span>
                    <span>{averageDuration} min</span>
                  </div>

                <div className="mt-4 border-t pt-3 text-purplecolor">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>{total > 0 ? `+$${total}` : `$0`}</span>

                  </div>

                  <p className="text-sm italic text-gray-400 mt-2 leading-tight">
                    * Final pricing depends on hair length, volume, and thickness.
                  </p>
                </div>


                <button 
                  className="mt-4 w-full bg-purplecolor text-white py-2 rounded-xl font-bold"
                  onClick={() => {
                    setShowDetails(false); // optional: collapse box
                    onContinue?.();        // ✅ trigger the parent navigation
                  }}
                >
                  Continue
                </button>

              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
