export function scrollToId(id, offset = 72) {
  const el = document.getElementById(id);
  if (!el) return;
  const prefersReduced =
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top: y, behavior: prefersReduced ? "auto" : "smooth" });
}
