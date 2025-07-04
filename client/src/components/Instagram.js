import React, { useEffect } from "react";

export default function Instagram() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.async = true;
    script.onload = () => {
      if (window.elfsight) {
        window.elfsight.platform.init();
      }
    };
    document.body.appendChild(script);
  }, []);

  return (
    <section className="bg-white pt-10 rounded-lg mb-0 ">
      <div className="text-center">
        <h2 className="text-3xl font-bodonimoda text-purplecolor mb-6 pt-10">
          <span className="border-t border-b border-gray-300 px-6">
            Follow Us On Instagram
          </span>
        </h2>
      </div>

      <div className="elfsight-app-97b29c11-2357-4daa-9f37-6c57d6157730" data-elfsight-app-lazy></div>
    </section>
  );
}
