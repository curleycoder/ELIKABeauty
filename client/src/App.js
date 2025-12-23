import './App.css';

import React from "react";
import { BrowserRouter as Router , Routes, Route} from "react-router-dom";
import ChatWidget from './components/ChatWidget';

import Home from "./pages/Home"
import Booking from "./pages/Booking"
import Product from "./pages/Product"
import AboutMe from "./components/AboutMe"
import Navbar from "./components/Navbar"
import Gallery from './components/Gallery';
import {SpeedInsights} from "@vercel/speed-insights/react"
import ArticlePage from "./pages/Article"
import ArticlesPage from './pages/ArticlesPage';
import ScrollToTop from './components/ScrollToTop';
import AdminBookings from './pages/AdminBookings';



function App() {
  return (
 
    <Router>
      <Navbar />
      <ChatWidget/>
      <ScrollToTop/>
      <div >
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/booking" element={<Booking />}/>
          <Route path='/gallery' element={<Gallery/>}/>
          <Route path="/articles/:slug" element={<ArticlePage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/product" element={<Product />}/>
          <Route path="/aboutme" element={<AboutMe />}/>
          <Route
          path="/admin-bookings-secret"
          element={<AdminBookings />}
        />
        </Routes>
        <SpeedInsights/>
      </div>
    </Router>

  );
}

export default App;
