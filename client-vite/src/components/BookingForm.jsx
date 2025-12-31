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
          <h3 className="font-display font-semibold text-[17px] sm:text-lg tracking-tight text-purplecolor">
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

export default function BookingForm({ onSelectionChange }) {
  const [selected, setSelected] = useState([]);
  const [activeTab, setActiveTab] = useState("Hair");
  const [conflictWarning, setConflictWarning] = useState(false);
  const [services, setServices] = useState([]);

  const baseURL = import.meta.env.VITE_API_URL || "https://api.beautyshohrestudio.ca";

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

  // When switching tabs, scroll to top so it feels instant + clean
  const listTopRef = useRef(null);
  useEffect(() => {
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activeTab]);

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-[30px] shadow-2xl max-w-2xl w-full mx-auto">
      {/* Header */}
      <div className="p-6 sm:p-8 pb-4 border-b border-purplecolor/10">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-display font-bold text-[#55203d]">
            Services
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Select your service(s). You can combine them.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex font-display font-bold flex-wrap gap-2 justify-center">
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

        {/* Compact selected “chips” row (optional, premium, no sheet) */}
        {selected.length > 0 && (
          <div className="mt-4 rounded-2xl border border-purplecolor/10 bg-white/70 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-purplecolor">
                {selected.length} selected • ${total}
              </div>
              <button
                className="text-xs font-bold text-purplecolor underline underline-offset-2"
                onClick={() => setSelected([])}
                type="button"
              >
                Clear
              </button>
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {selected.slice(0, 6).map((s) => (
                <button
                  key={s._id}
                  type="button"
                  onClick={() => handleToggle(s)}
                  className="px-3 py-1 rounded-full text-xs bg-purplecolor/10 text-purplecolor border border-purplecolor/15 hover:bg-purplecolor/15"
                  aria-label={`Remove ${s.name}`}
                >
                  {s.name} ✕
                </button>
              ))}
              {selected.length > 6 && (
                <div className="px-3 py-1 rounded-full text-xs bg-black/5 text-gray-600">
                  +{selected.length - 6} more
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Body (NO internal scroll) */}
      <div className="px-6 sm:px-8 py-5">
        <div ref={listTopRef} />

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
    </div>
  );
}
