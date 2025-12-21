import { useEffect, useState } from "react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 16,
            bottom: 88,
            width: 360,
            height: 520,
            maxWidth: "calc(100vw - 32px)",
            maxHeight: "calc(100vh - 120px)",
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: 16,
            boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
            overflow: "hidden",
            zIndex: 999999,
          }}
        >
          <div
            style={{
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 12px",
              borderBottom: "1px solid rgba(0,0,0,0.08)",
              fontFamily: "system-ui",
              fontSize: 14,
              background: "#fff",
            }}
          >
            <b>Beauty Shohre Assistant</b>
            <button
              onClick={() => setOpen(false)}
              style={{
                border: "none",
                background: "transparent",
                fontSize: 20,
                cursor: "pointer",
                lineHeight: 1,
              }}
              aria-label="Close chat"
              title="Close"
            >
              ×
            </button>
          </div>

          <iframe
            title="Beauty Shohre Chat"
            src="https://client-sand-kappa.vercel.app/"
            style={{
              width: "100%",
              height: "calc(100% - 48px)",
              border: "none",
            }}
          />
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          position: "fixed",
          right: 16,
          bottom: 16,
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
          zIndex: 999999,
          fontSize: 22,
        }}
        aria-label={open ? "Close chat" : "Open chat"}
        title={open ? "Close chat" : "Chat"}
      >
        💬
      </button>
    </>
  );
}
