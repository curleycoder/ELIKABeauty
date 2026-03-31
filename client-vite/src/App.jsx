import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Footer from "./components/Footer.jsx";

import Home from "./pages/Home.jsx";
import Booking from "./pages/Booking.jsx";
import ArticlePage from "./pages/Article.jsx";
import ArticlesPage from "./pages/ArticlesPage.jsx";
import Gallery from "./components/Gallery.jsx";
import AboutMe from "./pages/AboutMe.jsx";
import AdminBookings from "./pages/AdminBookings.jsx";
import Instagram from "./components/Instagram.jsx";
import Services from "./pages/Services.jsx";
import BookingConfirmed from "./pages/BookingConfirmed";

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
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import { SpeedInsights } from "@vercel/speed-insights/react";


export default function App() {

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-[#440008] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to main content
      </a>
      <Navbar />
      <ScrollToTop />

      <div id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:slug" element={<ArticlePage />} />
          <Route path="/about" element={<AboutMe />} />
          <Route path="/admin-bookings-secret" element={<AdminBookings />} />
          <Route path="/instagram" element={<Instagram />} />
          <Route path="/booking/confirmed" element={<BookingConfirmed />} />

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
          <Route path="/facial-burnaby" element={<FacialBurnaby />} />
          <Route path="/facial-treatment-burnaby" element={<FacialBurnaby />} />

          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <Footer />
      <SpeedInsights />
    </>
  );
}