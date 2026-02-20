import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";
import { Analytics } from "@vercel/analytics/react";
import { BrowserRouter } from "react-router-dom";
import RouteTracker from "./RouteTracker.jsx"; // ✅ add this

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <RouteTracker /> {/* ✅ here */}
        <div className="font-ranade">
          <App />
        </div>
      </BrowserRouter>

      <Analytics />
    </HelmetProvider>
  </React.StrictMode>
);