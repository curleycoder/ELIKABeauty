// import logo from './logo.svg';
import './App.css';

import React from "react";
import { BrowserRouter as Router , Routes, Route} from "react-router-dom";

import Home from "./pages/Home"
import Booking from "./pages/Booking"
import Product from "./pages/Product"
import AboutMe from "./components/AboutMe"
import Navbar from "./components/Navbar"
import Gallery from './components/Gallery';


function App() {
  return (
 
    <Router>
      <Navbar />

      <div >
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/booking" element={<Booking />}/>
          <Route path='/gallery' element={<Gallery/>}/>
          <Route path="/product" element={<Product />}/>
          <Route path="/aboutme" element={<AboutMe />}/>
        </Routes>
      </div>
    </Router>

  );
}

export default App;
