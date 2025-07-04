import React, { useState } from "react";
import logo from "../logo2.png";
import { useNavigate, useLocation } from "react-router-dom";
import { scroller } from "react-scroll";
import { Menu, X } from "lucide-react";   

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollTo = (target) => {
    const scrollFn = () => {
      scroller.scrollTo(target, {
        smooth: true,
        duration: 500,
        offset: -80,
      });
    };

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(scrollFn, 500);
    } else {
      scrollFn();
    }

    setMenuOpen(false); // ✅ Auto-close after scroll
  };

  const routeMap = {
    Home: "/",
    Booking: "/booking",
    Products: "/product",
  };

  const handleNavClick = (item) => {
    if (item.scroll) {
      scrollTo(item.scroll);
    } else {
      navigate(routeMap[item.name]);
      setMenuOpen(false); // ✅ Auto-close after route change
    }
  };

  const navItems = [
    { name: "Home" },
    { name: "Booking" },
    { name: "Products" },
    { name: "Gallery", scroll: "gallery-section" },
    { name: "About Me", scroll: "about-section" },
  ];

  return (
    <div className="bg-white shadow-md sticky top-0 z-50">
      <nav className="text-purplecolor px-4 py-3 sm:px-6 max-w-6xl mx-auto flex justify-between items-center font-bodonimoda">
        {/* Logo and Name */}
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Beauty Shohre Studio Logo" className="h-12 sm:h-16 w-auto" />
          <h1 className="text-lg sm:text-xl font-bold">BEAUTY SHOHRE STUDIO</h1>
        </div>

        {/* Mobile menu toggle */}
        <div className="sm:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-purplecolor focus:outline-none">
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-4">
          {navItems.map((item, index) => (
            <div
              key={index}
              onClick={() => handleNavClick(item)}
              className="cursor-pointer px-3 py-2 rounded-md border border-transparent hover:translate-y-[-2px] hover:text-pinkcolor transition-all duration-300"
            >
              {item.name}
            </div>
          ))}
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="sm:hidden bg-white px-4 pb-4 font-bodonimoda">
          {navItems.map((item, index) => (
            <div
              key={index}
              onClick={() => handleNavClick(item)}
              className="py-2 text-purplecolor border-b border-gray-200 cursor-pointer hover:text-pinkcolor transition"
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
