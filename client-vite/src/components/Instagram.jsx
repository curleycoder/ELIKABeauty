import React, { useEffect } from "react";

const ELFSIGHT_SRC = "https://static.elfsight.com/platform/platform.js";
const ELFSIGHT_APP_CLASS = "elfsight-app-97b29c11-2357-4daa-9f37-6c57d6157730";

function loadElfsightScript() {
  return new Promise((resolve, reject) => {
    // already loaded
    if (window.elfsight?.platform) return resolve(true);

    // already loading
    const existing = document.querySelector(`script[src="${ELFSIGHT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", reject);
      return;
    }

    // load fresh
    const script = document.createElement("script");
    script.src = ELFSIGHT_SRC;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

export default function Instagram() {
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await loadElfsightScript();
        if (cancelled) return;

        // Ensure container exists then init
        const container = document.querySelector(`.${ELFSIGHT_APP_CLASS}`);
        if (container && window.elfsight?.platform?.init) {
          window.elfsight.platform.init();
        }
      } catch (e) {
        console.error("Elfsight failed to load:", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-white pt-10 rounded-lg mb-0">
      <div className="text-center">
        <h2 className="text-3xl text-[#55203d] mb-6 pt-10">
          <span className="border-t border-b py-2 font-display border-gray-300 px-6">
            Follow Us On Instagram
          </span>
        </h2>
      </div>

      {/* give it height so you can see it even while loading */}
      <div className={`${ELFSIGHT_APP_CLASS} min-h-[320px]`} />
    </section>
  );
}
