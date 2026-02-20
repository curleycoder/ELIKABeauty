// src/RouteTracker.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    if (!window.gtag) return;
    window.gtag("event", "page_view", {
      page_path: location.pathname + location.search,
    });
  }, [location]);

  return null;
}