import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { FaPlus, FaCheck, FaExclamationTriangle } from "react-icons/fa";

const TABS = ["Hair", "Face", "Men", "Spa", "Wax", "Add ons"];
const SERVICES_CACHE_KEY = "elika-services-cache-v6";
const SERVICES_CACHE_LS_KEY = "elika-services-ls-v6";
const SERVICES_CACHE_TTL = 1000 * 60 * 60; // 1 hour

function normalizeCategory(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[-_]+/g, " ");
}

const ServiceCard = React.memo(function ServiceCard({ s, isSelected, onToggle }) {
  return (
    <div
      className={[
        "rounded-2xl border p-4 bg-white/80 backdrop-blur",
        "border-[#440008]/15 hover:border-[#440008]/30 transition",
        isSelected ? "border-2 border-[#440008] shadow-sm" : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display font-semibold text-[17px] sm:text-lg tracking-tight text-[#440008]">
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
              <p className="mt-1 text-gray-500 leading-snug line-clamp-2">
                {s.description}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onToggle}
          className={[
            "shrink-0 w-10 h-10 rounded-full border transition",
            "flex items-center justify-center",
            isSelected
              ? "bg-[#440008] text-white border-[#440008] shadow"
              : "bg-white text-[#440008] border-[#440008]/30 hover:bg-[#440008]/5",
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
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const listTopRef = useRef(null);
  const fetchControllerRef = useRef(null);

  const baseURL = (import.meta.env.VITE_API_URL || "https://api.elikabeauty.ca").replace(/\/$/, "");

  const selectedIds = useMemo(() => new Set(selected.map((s) => s._id)), [selected]);

  const filteredServices = useMemo(() => {
    const active = normalizeCategory(activeTab);
    return services.filter((s) => normalizeCategory(s.category) === active);
  }, [services, activeTab]);

  const total = useMemo(() => {
    return selected.reduce((sum, s) => sum + (Number(s?.price) || 0), 0);
  }, [selected]);

  const handleToggle = useCallback((service) => {
    setSelected((prev) => {
      const exists = prev.some((s) => s._id === service._id);
      return exists ? prev.filter((s) => s._id !== service._id) : [...prev, service];
    });
  }, []);

  const fetchServices = useCallback(
    async ({ forceFresh = false } = {}) => {
      fetchControllerRef.current?.abort();

      const ctrl = new AbortController();
      fetchControllerRef.current = ctrl;

      setStatus("loading");
      setErrorMsg("");

      if (!forceFresh) {
        // 1. Try sessionStorage (fastest — same tab)
        const cached = sessionStorage.getItem(SERVICES_CACHE_KEY);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed)) {
              setServices(parsed);
              setStatus("success");
              return;
            }
          } catch {
            sessionStorage.removeItem(SERVICES_CACHE_KEY);
          }
        }

        // 2. Try localStorage (survives page refresh, TTL 1h)
        try {
          const lsRaw = localStorage.getItem(SERVICES_CACHE_LS_KEY);
          if (lsRaw) {
            const { data, ts } = JSON.parse(lsRaw);
            if (Array.isArray(data) && Date.now() - ts < SERVICES_CACHE_TTL) {
              setServices(data);
              setStatus("success");
              sessionStorage.setItem(SERVICES_CACHE_KEY, JSON.stringify(data));
              return;
            }
          }
        } catch {
          localStorage.removeItem(SERVICES_CACHE_LS_KEY);
        }
      }

      try {
        const startedAt = performance.now();

        const res = await fetch(`${baseURL}/api/services`, {
          signal: ctrl.signal,
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        const normalized = Array.isArray(data) ? data : [];

        if (ctrl.signal.aborted) return;

        setServices(normalized);
        setStatus("success");
        sessionStorage.setItem(SERVICES_CACHE_KEY, JSON.stringify(normalized));
        try {
          localStorage.setItem(
            SERVICES_CACHE_LS_KEY,
            JSON.stringify({ data: normalized, ts: Date.now() })
          );
        } catch { /* storage full — ignore */ }

        console.log(
          `✅ services loaded in ${Math.round(performance.now() - startedAt)}ms`
        );
      } catch (err) {
        if (ctrl.signal.aborted) return;

        console.error("❌ Failed to load services:", err);
        setServices([]);
        setStatus("error");
        setErrorMsg("Services are loading slower than usual. Please try again.");
      }
    },
    [baseURL]
  );

  useEffect(() => {
    fetchServices();

    return () => {
      fetchControllerRef.current?.abort();
    };
  }, [fetchServices]);

  useEffect(() => {
    onSelectionChange?.({ selected, total });
  }, [selected, total, onSelectionChange]);

  useEffect(() => {
    const selectedNames = selected.map((s) => String(s.name || "").trim().toLowerCase());

    const hasKeratin = selectedNames.includes("keratin");
    const hasConflict = selectedNames.some((name) =>
      ["highlight", "balayage", "hair color"].includes(name)
    );

    setConflictWarning(hasKeratin && hasConflict);
  }, [selected]);


  return (
    <div className="bg-white backdrop-blur-md rounded-[30px] shadow-2xl max-w-2xl w-full mx-auto">
      <div className="p-6 sm:p-8 pb-4 border-b border-[#440008]/10">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-theseason font-bold text-[#440008]">
            Services
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Select your service(s). You can combine them.
          </p>
        </div>

        <div className="mt-4 flex font-theseason font-bold flex-wrap gap-2 justify-center">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={[
                "px-4 py-2 rounded-full font-bold text-sm transition-all",
                activeTab === tab
                  ? "bg-[#440008] text-white shadow-md scale-[1.02]"
                  : "bg-white text-[#440008] border border-[#440008]/20 hover:bg-[#440008]/5",
              ].join(" ")}
            >
              {tab}
            </button>
          ))}
        </div>

        {conflictWarning && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            <div className="font-bold flex items-center gap-2"><FaExclamationTriangle /> Not recommended together</div>
            <div className="text-sm mt-1">
              Keratin + (Highlight/Balayage/Hair Color) can damage hair. Book on separate days.
            </div>
          </div>
        )}

        {selected.length > 0 && (
          <div className="mt-4 rounded-2xl border border-[#440008]/10 bg-white/70 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-[#440008]">
                {selected.length} selected • ${total}
              </div>

              <button
                className="text-xs font-bold text-[#440008] underline underline-offset-2"
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
                  className="px-3 py-1 rounded-full text-xs bg-[#440008]/10 text-[#440008] border border-[#440008]/15 hover:bg-[#440008]/15"
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

      <div className="px-6 sm:px-8 py-5">
        <div ref={listTopRef} />

        {status === "loading" ? (
          <div className="text-center text-gray-500 py-10">Loading services…</div>
        ) : status === "error" ? (
          <div className="text-center text-gray-500 py-10 space-y-3">
            <div>{errorMsg || "Failed to load services."}</div>

            <button
              type="button"
              onClick={() => fetchServices({ forceFresh: true })}
              className="px-4 py-2 rounded-full bg-[#440008] text-white font-bold"
            >
              Retry
            </button>
          </div>
        ) : filteredServices.length === 0 ? (
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