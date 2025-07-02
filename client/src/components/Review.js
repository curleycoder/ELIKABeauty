import React, { useEffect } from "react";

export default function ReviewsSection() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <section className="bg-white p-6 rounded-lg mx-6 mb-10">
        <div className="text-center">
            <h2 className="text-3xl font-bodonimoda text-[#55203d] mb-6">
                <span className="border-t border-b border-gray-300 px-6">
                What Our Clients Say
                </span>
            </h2>
        </div>

      <div className="elfsight-app-ee700615-b2ad-4723-b0a7-f6f9507700e6" data-elfsight-app-lazy></div>
    </section>
  );
}
