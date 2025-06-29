// import logo from './logo.svg';
// import './App.css';

import React from "react";
import { BrowserRouter as Router , Routes, Route} from "react-router-dom";

import Home from "./pages/Home"
import Booking from "./pages/Booking"
import Product from "./pages/Product"
import About from "./pages/About"
import Navbar from "./components/Navbar"


function App() {
  return (
    <Router>
      <Navbar />

      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/booking" element={<Booking />}/>
          <Route path="/product" element={<Product />}/>
          <Route path="/about" element={<About />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
