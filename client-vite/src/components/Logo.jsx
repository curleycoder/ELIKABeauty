import React from "react";
import logoSvg from "../assets/logo.svg";

const IMAGE_SIZES = {
  sm: "h-8",
  md: "h-10",
  lg: "h-14",
};

const TEXT_SIZES = {
  sm: {
    elika: "text-xl",
    sub: "text-[10px]",
    gap: "gap-2",
  },
  md: {
    elika: "text-2xl",
    sub: "text-xs",
    gap: "gap-2.5",
  },
  lg: {
    elika: "text-4xl",
    sub: "text-sm",
    gap: "gap-3",
  },
};

export default function Logo({
  size = "md",
  color = "#572a31",
  showText = true,
  className = "",
}) {
  const imgSize = IMAGE_SIZES[size] || IMAGE_SIZES.md;
  const textSize = TEXT_SIZES[size] || TEXT_SIZES.md;

  return (
    <div className={`flex items-center ${textSize.gap} ${className}`}>
      {/* Logo Image */}
      <img
        src={logoSvg}
        alt="Elika Beauty"
        className={`${imgSize} w-auto select-none`}
        draggable="false"
        loading="eager"
      />

      {/* Text Next to Logo */}
{showText && (
  <div
    className={`flex items-baseline pt-1 gap-1 ${textSize.gap}`}
    style={{ color }}
  >
    <span
      className={`font-theseason leading-none ${textSize.elika}`}
    >
      ELIKA
    </span>

    <span
      className={`font-theseason uppercase ${textSize.elika}`}
    >
      Beauty
    </span>
  </div>
)}
    </div>
  );
}