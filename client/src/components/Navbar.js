import React, { useEffect, useState } from "react";
import logo from "../logo2.png";
import { useNavigate, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { scrollToId } from "../lib/scrollTo";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const HEADER_OFFSET = 80; // adjust to your sticky header height

  // If we navigated to "/", perform the pending scroll
  useEffect(() => {
    const target = location.state?.scrollTarget;
    if (location.pathname === "/" && target) {
      // let the section render, then scroll
      setTimeout(() => scrollToId(target, HEADER_OFFSET), 50);
      // clear the state so it doesn't re-trigger
      navigate(".", { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);

  const goToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTarget: id } });
    } else {
      scrollToId(id, HEADER_OFFSET);
    }
    setMenuOpen(false);
  };

  const routeMap = { Home: "/", Booking: "/booking",Articles: "/articles", Products: "/product" };

  const handleNavClick = (item) => {
    if (item.scroll) {
      goToSection(item.scroll);
    } else {
      navigate(routeMap[item.name]);
      setMenuOpen(false);
    }
  };

  const navItems = [
    { name: "Home" },
    { name: "Booking" },
    { name: "Gallery", scroll: "gallery-section" },
    { name: "Articles" },
    { name: "Products" },
    { name: "About Me", scroll: "about-section" },
  ];

  return (
    <div className="bg-white shadow-md sticky top-0 z-50">
      <nav className="text-purplecolor px-4 py-3 sm:px-6 max-w-6xl mx-auto flex justify-between items-center font-bodonimoda">
        <div className="flex items-center space-x-3">
          <img
            src={logo}
            alt="Beauty Shohre Studio Logo"
            className="h-12 sm:h-16 w-auto cursor-pointer"
            onClick={() => navigate("/")}
          />
          <h1 className="text-lg sm:text-xl font-bold">BEAUTY SHOHRE STUDIO</h1>
        </div>

        <div className="sm:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-purplecolor focus:outline-none">
            {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-4">
          {navItems.map((item, i) => (
            <button
              key={i}
              onClick={() => handleNavClick(item)}
              className="cursor-pointer px-3 py-2 rounded-md border border-transparent hover:translate-y-[-2px] hover:text-pinkcolor transition-all duration-300"
            >
              {item.name}
            </button>
          ))}
        </div>
      </nav>

      {menuOpen && (
        <div className="sm:hidden bg-white px-4 pb-4 font-bodonimoda">
          {navItems.map((item, i) => (
            <button
              key={i}
              onClick={() => handleNavClick(item)}
              className="block w-full text-left py-2 text-purplecolor border-b border-gray-200 hover:text-pinkcolor transition"
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
