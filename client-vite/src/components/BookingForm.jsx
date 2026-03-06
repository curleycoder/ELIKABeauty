import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { FaPlus, FaCheck } from "react-icons/fa";

const TABS = ["Hair", "Face", "Men", "Spa", "Add ons"];

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
                <span className="text-sm text-gray-600 ml-0.5 align-top">+</span>
              )}
              <span className="text-xs text-gray-600 ml-2">• {s.duration || 0} min</span>
            </div>

            {!!s.description && (
              <p className="mt-1 text-gray-500 leading-snug line-clamp-2">{s.description}</p>
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

  // ✅ NEW: proper fetch state (prevents “No services” glitch during slow loads)
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const baseURL = import.meta.env.VITE_API_URL || "https://api.elikabeauty.ca";

  // ✅ FIXED: abort-safe + retry fetch
  useEffect(() => {
    const ctrl = new AbortController();

    (async () => {
      setStatus("loading");
      setErrorMsg("");

      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const res = await fetch(`${baseURL}/api/services`, {
            signal: ctrl.signal,
            cache: "no-store",
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);

          const data = await res.json();

          if (!ctrl.signal.aborted) {
            setServices(Array.isArray(data) ? data : []);
            setStatus("success");
          }
          return;
        } catch (err) {
          if (ctrl.signal.aborted) return;
          const delay = Math.min(300 * 2 ** (attempt - 1), 1200);
          await new Promise((r) => setTimeout(r, delay));
        }
      }

      if (!ctrl.signal.aborted) {
        setServices([]);
        setStatus("error");
        setErrorMsg("Services are loading slower than usual. Please try again.");
      }
    })();

    return () => ctrl.abort();
  }, [baseURL]);

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

  useEffect(() => {
    onSelectionChange?.({ selected, total });
  }, [selected, total, onSelectionChange]);

  useEffect(() => {
    const hasKeratin = selected.some((s) => s.name === "Keratin");
    const conflicting = ["Highlight", "Balayage", "Hair Color"];
    const hasConflict = selected.some((s) => conflicting.includes(s.name));
    setConflictWarning(hasKeratin && hasConflict);
  }, [selected]);

  const listTopRef = useRef(null);
  useEffect(() => {
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activeTab]);

  return (
    <div className="bg-white backdrop-blur-md rounded-[30px] shadow-2xl max-w-2xl w-full mx-auto">
      {/* Header */}
      <div className="p-6 sm:p-8 pb-4 border-b border-purplecolor/10">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-theseason font-bold text-[#7a3b44]">
            Services
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Select your service(s). You can combine them.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex font-theseason font-bold flex-wrap gap-2 justify-center">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={[
                "px-4 py-2 rounded-full font-bold text-sm transition-all",
                activeTab === tab
                  ? "bg-[#7a3b44] text-white shadow-md scale-[1.02]"
                  : "bg-white text-[#7a3b44] border border-purplecolor/20 hover:bg-purplecolor/5",
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

      {/* Body */}
      <div className="px-6 sm:px-8 py-5">
        <div ref={listTopRef} />

        {/* ✅ FIXED: loading/error/empty are distinct */}
        {status === "loading" ? (
          <div className="text-center text-gray-500 py-10">Loading services…</div>
        ) : status === "error" ? (
          <div className="text-center text-gray-500 py-10 space-y-3">
            <div>{errorMsg || "Failed to load services."}</div>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-full bg-[#7a3b44] text-white font-bold"
            >
              Retry
            </button>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No services in this category.</div>
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