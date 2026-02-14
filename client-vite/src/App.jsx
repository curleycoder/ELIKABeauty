import "./App.css";
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
// import ChatWidget from "./components/ChatWidget.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

import Home from "./pages/Home.jsx";
import Booking from "./pages/Booking.jsx";
import Product from "./pages/Product.jsx";
import ArticlePage from "./pages/Article.jsx";
import ArticlesPage from "./pages/ArticlesPage.jsx";
import Gallery from "./components/Gallery.jsx";
import AboutMe from "./components/AboutMe.jsx";
import AdminBookings from "./pages/AdminBookings.jsx";
import Instagram from "./components/Instagram.jsx";

import { SpeedInsights } from "@vercel/speed-insights/react";

export default function App() {
  const { pathname } = useLocation();

  // ✅ hide chat widget on booking flow (add more paths if needed)
  // const hideChatWidget = pathname.startsWith("/booking");

  return (
    <>
      <Navbar />
      {/* {!hideChatWidget && <ChatWidget />} */}
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/articles/:slug" element={<ArticlePage />} />
        <Route path="/product" element={<Product />} />
        <Route path="/aboutme" element={<AboutMe />} />
        <Route path="/admin-bookings-secret" element={<AdminBookings />} />
        <Route path="/instagram" element={<Instagram />} />
      </Routes>

      <SpeedInsights />
    </>
  );
}
