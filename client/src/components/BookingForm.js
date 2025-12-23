import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FaPlus, FaCheck } from "react-icons/fa";

const ServiceCard = React.memo(function ServiceCard({ s, isSelected, onToggle }) {
  return (
    <div
      className={[
        // ✅ border instead of heavy shadow (much smoother scroll on mobile)
        "bg-white rounded-xl border border-black/10 p-4",
        "flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3",
        isSelected ? "border-2 border-purplecolor" : "",
      ].join(" ")}
    >
      <div className="flex-1">
        <h3 className="font-semibold text-lg text-gray-900">{s.name}</h3>

        <div className="text-sm text-gray-600 mt-1">
          <span className="block">
            ${s.price}
            {s.fromPrice && (
              <span className="text-xs text-gray-400 ml-0.5 align-top">+</span>
            )}
          </span>

          <span className="block truncate">{s.description}</span>
        </div>
      </div>

      <div className="sm:self-end sm:ml-4">
        <button
          onClick={onToggle}
          className={[
            "mt-2 sm:mt-0 p-2 border rounded-full transition",
            isSelected
              ? "bg-purplecolor text-white border-purplecolor"
              : "bg-white text-purplecolor border-purplecolor hover:bg-purplecolor/5",
          ].join(" ")}
          aria-label={isSelected ? "Remove service" : "Add service"}
        >
          {isSelected ? <FaCheck /> : <FaPlus />}
        </button>
      </div>
    </div>
  );
});

export default function BookingForm({
  onSelectionChange,
  averageDuration,
  onContinue,
}) {
  const [selected, setSelected] = useState([]);
  const [activeTab, setActiveTab] = useState("Hair");
  const [conflictWarning, setConflictWarning] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [services, setServices] = useState([]);

  const baseURL = process.env.REACT_APP_API_URL || "";
  const tabs = ["Hair", "Face", "Men", "Add-ons"];

  // ✅ Fetch services once (and re-run if baseURL changes)
  useEffect(() => {
    let cancelled = false;

    const fetchServices = async () => {
      try {
        const response = await fetch(`${baseURL}/api/services`);
        const data = await response.json();
        if (!cancelled) setServices(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };

    fetchServices();
    return () => {
      cancelled = true;
    };
  }, [baseURL]);

  // ✅ FAST: O(1) selection checks instead of selected.some() everywhere
  const selectedIds = useMemo(() => new Set(selected.map((s) => s._id)), [selected]);

  // ✅ Memoize filtered list
  const filteredServices = useMemo(() => {
    return services.filter((s) => s.category === activeTab);
  }, [services, activeTab]);

  // ✅ Memoize total
  const total = useMemo(() => {
    return selected.reduce((sum, s) => sum + (s?.price || 0), 0);
  }, [selected]);

  // ✅ Stable select handler
  const handleSelect = useCallback((service) => {
    setSelected((prev) => {
      const exists = prev.some((s) => s._id === service._id);
      return exists ? prev.filter((s) => s._id !== service._id) : [...prev, service];
    });
  }, []);

  // ✅ Notify parent when selection changes
  useEffect(() => {
    onSelectionChange?.({ selected, total });
  }, [selected, total, onSelectionChange]);

  // ✅ Conflict warning logic
  useEffect(() => {
    const hasKeratin = selected.some((s) => s.name === "Keratin");
    const conflicting = ["Highlight", "Balayage", "Hair Color"];
    const hasConflict = selected.some((s) => conflicting.includes(s.name));
    setConflictWarning(hasKeratin && hasConflict);
  }, [selected]);

  return (
    <div className="font-bodonimoda px-2 pb-16 h-full flex flex-col">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-3xl text-purplecolor mb-4">Services</h2>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={[
              "px-3 py-1.5 rounded-full font-semibold text-sm transition-all",
              activeTab === tab
                ? "bg-purplecolor text-white shadow-md scale-105"
                : "bg-white text-purplecolor hover:translate-y-[-2px]",
            ].join(" ")}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Scroll area */}
      <div className="mt-4 flex-1 min-h-0 overflow-y-auto overscroll-contain [webkit-overflow-scrolling:touch]">
        {conflictWarning && (
          <div className="transition-opacity duration-300 ease-in-out border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">⚠️ Warning:</strong>
            <span className="block sm:inline ml-2">
              These two services can't be done in one day. We care about the health of your hair 💜
            </span>
          </div>
        )}

        <div className="space-y-4">
          {filteredServices.map((s) => {
            const isSelected = selectedIds.has(s._id);
            return (
              <ServiceCard
                key={s._id}
                s={s}
                isSelected={isSelected}
                onToggle={() => handleSelect(s)}
              />
            );
          })}
        </div>
      </div>

      {/* Sticky Bar */}
      {selected.length > 0 && (
        <>
          <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow z-50 p-4 sm:hidden will-change-transform">
            <div className="flex justify-between items-center text-purplecolor font-semibold text-lg">
              <div>
                {selected.length} service{selected.length > 1 ? "s" : ""} • ${total}
              </div>
              <button onClick={() => setShowDetails((v) => !v)}>
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
                  {selected.map((s, i) => {
                    if (!s || typeof s.name !== "string" || typeof s.price !== "number")
                      return null;
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
                    <span>Estimated Total:</span>
                    <span>{total > 0 ? `+$${total}` : `$0`}</span>
                  </div>

                  <p className="text-sm italic text-gray-400 mt-2 leading-tight">
                    * Final pricing depends on hair length, volume, and thickness.
                  </p>
                </div>

                <button
                  className="mt-4 w-full bg-purplecolor text-white py-2 rounded-xl font-bold"
                  onClick={() => {
                    setShowDetails(false);
                    onContinue?.();
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
