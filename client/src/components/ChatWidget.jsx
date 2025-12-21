import { useEffect, useState } from "react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      {/* Panel */}
      <div
        className={[
          "fixed z-[999999] right-4 bottom-20 w-[380px] h-[560px]",
          "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-8rem)]",
          "rounded-2xl overflow-hidden border border-black/10",
          "bg-white/90 backdrop-blur-md shadow-2xl",
          "origin-bottom-right transition-all duration-150",
          open ? "scale-100 opacity-100 pointer-events-auto" : "scale-95 opacity-0 pointer-events-none",
          "sm:right-4",
          "max-[520px]:left-3 max-[520px]:right-3 max-[520px]:w-auto max-[520px]:h-[70vh]",
        ].join(" ")}
      >
        {/* Header */}
        <div className="h-12 flex items-center justify-between px-4 border-b border-black/5 bg-gradient-to-b from-pink-100/70 to-white/80">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-pink-200/70 grid place-items-center">
              <span className="text-sm">💬</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-black/90">Beauty Shohre Assistant</div>
              <div className="text-[11px] text-black/50">Quick answers • Booking help</div>
            </div>
          </div>

          <button
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
          src="https://client-sand-kappa.vercel.app"
          className="w-full h-[calc(100%-3rem)] border-0"
        />
      </div>

      {/* Bubble */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={[
          "fixed z-[999999] right-4 bottom-4 h-14 w-14 rounded-full",
          "grid place-items-center shadow-2xl",
          "bg-white",
          "hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(0,0,0,0.22)]",
          "transition",
        ].join(" ")}
        aria-label={open ? "Close chat" : "Open chat"}
        title={open ? "Close chat" : "Chat"}
      >
        <img
            src="/sherry1.jpg"
            alt="Chat"
            className="h-12 w-12 rounded-full object-cover"
            />

      </button>
    </>
  );
}
