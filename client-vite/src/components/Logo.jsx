export default function Logo({ size = "md", color = "#7a3b44" }) {
  const sizes = {
    sm: {
      elika: "text-3xl",
      sub: "text-[10px]",   // 🔹 smaller
      gap: "gap-1.5",
    },
    md: {
      elika: "text-4xl",
      sub: "text-xs",       // 🔹 smaller
      gap: "gap-2",
    },
    lg: {
      elika: "text-6xl",
      sub: "text-xs",       // 🔹 still restrained
      gap: "gap-3",
    },
  };

  const s = sizes[size];

  return (
    <div className={`flex items-end ${s.gap}`} style={{ color }}>
      <span className={`font-theseason leading-none ${s.elika}`}>
        ELIKA
      </span>

<span
        className={`font-sans uppercase tracking-[0.2em] ${s.sub}`}
        style={{ opacity: 0.75 }} 
      >        Beauty Salon
      </span>
    </div>
  );
}
