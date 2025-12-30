import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { FaPlus, FaCheck } from "react-icons/fa";

const TABS = ["Hair", "Face", "Men", "Add-ons"];

const ServiceCard = React.memo(function ServiceCard({ s, isSelected, onToggle }) {
  return (
    <div
      className={[
        "rounded-2xl border p-4 bg-white/80 backdrop-blur",
        "border-purplecolor/15 hover:border-purplecolor/30 transition",
        isSelected ? "border-2 border-purplecolor shadow-sm" : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-[16px] sm:text-lg text-purplecolor">
            {s.name}
          </h3>

          <div className="mt-1 text-sm text-gray-600">
            <div className="font-semibold text-gray-800">
              ${s.price}
              {s.fromPrice && (
                <span className="text-xs text-gray-400 ml-0.5 align-top">+</span>
              )}
              <span className="text-xs text-gray-400 ml-2">
                • {s.duration || 0} min
              </span>
            </div>

            {!!s.description && (
              <p className="mt-1 text-gray-500 leading-snug line-clamp-2">
                {s.description}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={onToggle}
          className={[
            "shrink-0 w-10 h-10 rounded-full border transition",
            "flex items-center justify-center",
            isSelected
              ? "bg-purplecolor text-white border-purplecolor shadow"
              : "bg-white text-purplecolor border-purplecolor/30 hover:bg-purplecolor/5",
          ].join(" ")}
          aria-label={isSelected ? "Remove service" : "Add service"}
        >
          {isSelected ? <FaCheck /> : <FaPlus />}
        </button>
      </div>
    </div>
  );
});

export default function BookingForm({ onSelectionChange, averageDuration, onContinue }) {
  const [selected, setSelected] = useState([]);
  const [activeTab, setActiveTab] = useState("Hair");
  const [conflictWarning, setConflictWarning] = useState(false);
  const [services, setServices] = useState([]);

  // Mobile sheet
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetRef = useRef(null);

  const baseURL =
    import.meta.env.VITE_API_URL || "https://api.beautyshohrestudio.ca";

  // Fetch services once
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`${baseURL}/api/services`);
        const data = await res.json();
        if (!cancelled) setServices(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching services:", err);
        if (!cancelled) setServices([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [baseURL]);

  // FAST selection checks
  const selectedIds = useMemo(() => new Set(selected.map((s) => s._id)), [selected]);

  const filteredServices = useMemo(() => {
    return services.filter((s) => s.category === activeTab);
  }, [services, activeTab]);

  const total = useMemo(() => {
    return selected.reduce((sum, s) => sum + (s?.price || 0), 0);
  }, [selected]);

  const handleToggle = useCallback((service) => {
    setSelected((prev) => {
      const exists = prev.some((s) => s._id === service._id);
      return exists ? prev.filter((s) => s._id !== service._id) : [...prev, service];
    });
  }, []);

  // Notify parent
  useEffect(() => {
    onSelectionChange?.({ selected, total });
  }, [selected, total, onSelectionChange]);

  // Conflict warning
  useEffect(() => {
    const hasKeratin = selected.some((s) => s.name === "Keratin");
    const conflicting = ["Highlight", "Balayage", "Hair Color"];
    const hasConflict = selected.some((s) => conflicting.includes(s.name));
    setConflictWarning(hasKeratin && hasConflict);
  }, [selected]);

  // Auto-close sheet if empty
  useEffect(() => {
    if (selected.length === 0) setSheetOpen(false);
  }, [selected.length]);

  return (
    <div
      className="
        bg-white/60 backdrop-blur-md rounded-[30px] shadow-2xl
        max-w-2xl w-full mx-auto
        flex flex-col
        max-h-[80dvh]
      "
    >
      {/* Header (fixed, like DateTimePicker) */}
      <div className="p-6 sm:p-8 pb-4 border-b border-purplecolor/10">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-purplecolor">Services</h2>
          <p className="text-sm text-gray-500 mt-1">
            Select your service(s). You can combine them.
          </p>
        </div>

        {/* Tabs (same “pill” style) */}
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={[
                "px-4 py-2 rounded-full font-semibold text-sm transition-all",
                activeTab === tab
                  ? "bg-purplecolor text-white shadow-md scale-[1.02]"
                  : "bg-white text-purplecolor border border-purplecolor/20 hover:bg-purplecolor/5",
              ].join(" ")}
            >
              {tab}
            </button>
          ))}
        </div>

        {conflictWarning && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            <div className="font-bold">⚠️ Not recommended together</div>
            <div className="text-sm mt-1">
              Keratin + (Highlight/Balayage/Hair Color) can damage hair. Book on separate days.
            </div>
          </div>
        )}
      </div>

      {/* Scroll body (exact pattern as DateTimePicker) */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 sm:px-8 py-5">
        {filteredServices.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No services in this category.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredServices.map((s) => (
              <ServiceCard
                key={s._id}
                s={s}
                isSelected={selectedIds.has(s._id)}
                onToggle={() => handleToggle(s)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop: NO extra footer — use the right-side summary column */}
      {/* Mobile: sticky actions (because right-side summary is hidden) */}
      <div className="sm:hidden border-t border-purplecolor/10 bg-white/90 backdrop-blur px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="text-purplecolor">
            <div className="font-bold leading-tight">
              {selected.length || 0} selected • ${total}
            </div>
            <div className="text-xs text-gray-500">{averageDuration} min est.</div>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={selected.length === 0}
              onClick={() => setSheetOpen(true)}
              className={[
                "px-4 py-2 rounded-full font-semibold border transition",
                selected.length === 0
                  ? "border-purplecolor/15 text-purplecolor/40"
                  : "border-purplecolor/30 text-purplecolor bg-white",
              ].join(" ")}
            >
              View
            </button>

            <button
              disabled={selected.length === 0}
              onClick={() => onContinue?.()}
              className={[
                "px-4 py-2 rounded-full font-bold transition",
                selected.length === 0
                  ? "bg-purplecolor/20 text-white cursor-not-allowed"
                  : "bg-purplecolor text-white hover:brightness-110",
              ].join(" ")}
            >
              Continue
            </button>
          </div>
        </div>
      </div>

      {/* Mobile bottom sheet */}
      {sheetOpen && selected.length > 0 && (
        <div className="sm:hidden fixed inset-0 z-[9999]">
          <button
            className="absolute inset-0 bg-black/40"
            onClick={() => setSheetOpen(false)}
            aria-label="Close"
          />
          <div
            ref={sheetRef}
            className="
              absolute bottom-0 left-0 right-0
              bg-white rounded-t-[28px] shadow-2xl
              p-5
              max-h-[70dvh] overflow-y-auto
            "
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-purplecolor">Your Selection</h3>
              <button
                onClick={() => setSheetOpen(false)}
                className="px-3 py-1 rounded-full border border-purplecolor/20 text-purplecolor font-semibold"
              >
                Close
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {selected.map((s) => (
                <div key={s._id} className="flex justify-between text-sm">
                  <span className="text-gray-800">{s.name}</span>
                  <span className="text-gray-700 font-semibold">${s.price}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-purplecolor/10 bg-purplecolor/5 p-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Time on Service</span>
                <span className="font-semibold">{averageDuration} min</span>
              </div>
              <div className="flex justify-between mt-2 text-purplecolor font-bold text-lg">
                <span>Total</span>
                <span>${total}</span>
              </div>
              <p className="text-xs italic text-gray-400 mt-2">
                * Final pricing depends on hair length, volume, and thickness.
              </p>

              <button
                className="mt-4 w-full py-3 rounded-full bg-purplecolor text-white font-bold hover:brightness-110 transition"
                onClick={() => {
                  setSheetOpen(false);
                  onContinue?.();
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
