import "./App.css";
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

import Home from "./pages/Home.jsx";
import Booking from "./pages/Booking.jsx";
import ArticlePage from "./pages/Article.jsx";
import ArticlesPage from "./pages/ArticlesPage.jsx";
import Gallery from "./components/Gallery.jsx";
import AboutMe from "./pages/AboutMe.jsx";
import AdminBookings from "./pages/AdminBookings.jsx";
import Instagram from "./components/Instagram.jsx";
import Services from "./pages/Services.jsx";

import Balayage from "./pages/BalayageBurnaby.jsx";
import Highlight from "./pages/HighlightsBurnaby.jsx";
import Keratin from "./pages/KeratinTreatmentBurnaby.jsx";
import MensHaircut from "./pages/MensHaircutBurnaby.jsx";
import Perm from "./pages/PermBurnaby.jsx";
import WomensHaircut from "./pages/WomensHaircutBurnaby.jsx";
import HairSalonBurnaby from "./pages/HairSalonBurnaby";
import HairColorBurnaby from "./pages/HairColorBurnaby";
import MicrobladingBurnaby from "./pages/MicrobladingBurnaby";
import ThreadingBurnaby from "./pages/ThreadingBurnaby";
import RelaxationMassageBurnaby from "./pages/MassageBurnaby";
import FacialBurnaby from "./pages/FacialBurnaby";

import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";

import { SpeedInsights } from "@vercel/speed-insights/react";


export default function App() {
  const { pathname } = useLocation();

  return (
    <>
      <Navbar />
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/articles/:slug" element={<ArticlePage />} />
        <Route path="/about" element={<AboutMe />} />
        <Route path="/admin-bookings-secret" element={<AdminBookings />} />
        <Route path="/instagram" element={<Instagram />} />

        {/* SERVICES HUB */}
        <Route path="/services" element={<Services />} />

        {/* SERVICE PAGES */}
        <Route path="/balayage-burnaby" element={<Balayage />} />
        <Route path="/highlights-burnaby" element={<Highlight />} />
        <Route path="/keratin-treatment-burnaby" element={<Keratin />} />
        <Route path="/perm-burnaby" element={<Perm />} />
        <Route path="/womens-haircut-burnaby" element={<WomensHaircut />} />
        <Route path="/mens-haircut-burnaby" element={<MensHaircut />} />
        <Route path="/hair-salon-burnaby" element={<HairSalonBurnaby />} />
        <Route path="/hair-color-burnaby" element={<HairColorBurnaby />} />
        <Route path="/microblading-burnaby" element={<MicrobladingBurnaby />} />
        <Route path="/threading-burnaby" element={<ThreadingBurnaby />} />
        <Route
          path="/relaxation-body-massage-burnaby"
          element={<RelaxationMassageBurnaby />}
        />
        <Route path="/facial-burnaby" element={<FacialBurnaby />}/>

        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        
      </Routes>

      <SpeedInsights />
    </>
  );
}