import "./App.css";
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Footer from "./components/Footer.jsx";

import { SpeedInsights } from "@vercel/speed-insights/react";

// Lazy-load all pages — each becomes a separate JS chunk
// Only the current page's chunk is downloaded, not all 30+
const Home                   = lazy(() => import("./pages/Home.jsx"));
const Booking                = lazy(() => import("./pages/Booking.jsx"));
const BookingConfirmed       = lazy(() => import("./pages/BookingConfirmed"));
const Gallery                = lazy(() => import("./components/Gallery.jsx"));
const ArticlesPage           = lazy(() => import("./pages/ArticlesPage.jsx"));
const ArticlePage            = lazy(() => import("./pages/Article.jsx"));
const AboutMe                = lazy(() => import("./pages/AboutMe.jsx"));
const Services               = lazy(() => import("./pages/Services.jsx"));
const Contact                = lazy(() => import("./pages/Contact"));
const PrivacyPolicy          = lazy(() => import("./pages/PrivacyPolicy"));
const Terms                  = lazy(() => import("./pages/Terms"));
const AdminBookings          = lazy(() => import("./pages/AdminBookings.jsx"));
const Instagram              = lazy(() => import("./components/Instagram.jsx"));
const NotFound               = lazy(() => import("./pages/NotFound"));

// Service pages
const Balayage               = lazy(() => import("./pages/BalayageBurnaby.jsx"));
const Highlight              = lazy(() => import("./pages/HighlightsBurnaby.jsx"));
const Keratin                = lazy(() => import("./pages/KeratinTreatmentBurnaby.jsx"));
const MensHaircut            = lazy(() => import("./pages/MensHaircutBurnaby.jsx"));
const Perm                   = lazy(() => import("./pages/PermBurnaby.jsx"));
const WomensHaircut          = lazy(() => import("./pages/WomensHaircutBurnaby.jsx"));
const HairSalonBurnaby       = lazy(() => import("./pages/HairSalonBurnaby"));
const HairColorBurnaby       = lazy(() => import("./pages/HairColorBurnaby"));
const MicrobladingBurnaby    = lazy(() => import("./pages/MicrobladingBurnaby"));
const ThreadingBurnaby       = lazy(() => import("./pages/ThreadingBurnaby"));
const RelaxationMassageBurnaby = lazy(() => import("./pages/MassageBurnaby"));
const FacialBurnaby          = lazy(() => import("./pages/FacialBurnaby"));

// Minimal fallback shown during chunk download (first visit only)
function PageLoader() {
  return <div className="min-h-screen bg-[#E4E2DD]" aria-hidden="true" />;
}

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
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/booking/confirmed" element={<BookingConfirmed />} />
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
            <Route path="/relaxation-body-massage-burnaby" element={<RelaxationMassageBurnaby />} />
            <Route path="/facial-burnaby" element={<FacialBurnaby />} />
            <Route path="/facial-treatment-burnaby" element={<FacialBurnaby />} />

            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>

      <Footer />
      <SpeedInsights />
    </>
  );
}
