import { useEffect, useState } from "react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    // ✅ This wrapper is the whole fix: it cannot block swipes anywhere on the page.
    <div className="fixed inset-0 z-[999999] pointer-events-none">
      {/* Backdrop only when open (click to close) */}
      {open && (
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="pointer-events-auto absolute inset-0 bg-black/20"
          aria-label="Close chat backdrop"
        />
      )}

      {/* Panel */}
      <div
        className={[
          "pointer-events-auto",
          "absolute right-4 bottom-28 w-[380px] h-[560px]",
          "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-8rem)]",
          "rounded-2xl overflow-hidden border border-black/10",
          "bg-white/90 backdrop-blur-md shadow-2xl",
          "origin-bottom-right transition-all duration-150",
          open ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none",
          "max-[520px]:left-3 max-[520px]:right-3 max-[520px]:w-auto max-[520px]:h-[70vh]",
        ].join(" ")}
        style={{ touchAction: "pan-y" }}
      >
        {/* Header */}
        <div className="h-12 flex items-center justify-between px-4 border-b border-black/5 bg-white">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-pink-200/70 grid place-items-center overflow-hidden">
              <img
                src="/sherry1.jpg"
                alt="Beauty Shohre Studio"
                className="h-7 w-7 object-cover"
                draggable="false"
              />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-display font-semibold text-[#55203d]">
                Beauty Shohre Studio
              </div>
              <div className="text-[11px] text-[#55203d]/70">
                Quick answers • Booking help
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="h-9 w-9 rounded-xl border border-black/10 bg-white/70 hover:bg-white transition grid place-items-center"
            aria-label="Close chat"
            title="Close"
          >
            <span className="text-lg leading-none">×</span>
          </button>
        </div>

        {/* Iframe */}
        <iframe
          title="Beauty Shohre Chat"
          src="https://client-sand-kappa.vercel.app/?biz=beautyshohre&embed=1"
          className="w-full h-[calc(100%-3rem)] border-0"
        />
      </div>

      {/* Bubble */}
      {!open && (
        <div className="pointer-events-auto absolute right-8 bottom-8">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={[
              "h-20 w-20 rounded-full",
              "grid place-items-center shadow-2xl",
              "bg-white ring-2 ring-[#eabec5]",
              "hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(0,0,0,0.22)]",
              "transition",
            ].join(" ")}
            aria-label="Open chat"
            title="Chat"
            style={{ touchAction: "manipulation" }}
          >
            <img
              src="/sherry1.jpg"
              alt="Beauty Shohre Assistant"
              className="h-16 w-16 rounded-full object-cover"
              draggable="false"
            />
          </button>
        </div>
      )}
    </div>
  );
}
