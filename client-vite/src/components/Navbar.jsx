import { useEffect, useState } from "react";
import logo from "../logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { scrollToId } from "../lib/scrollTo";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const HEADER_OFFSET = 80;

  const pendingTarget = location.state?.scrollTarget;

  useEffect(() => {
    if (location.pathname === "/" && pendingTarget) {
      const t = setTimeout(() => scrollToId(pendingTarget, HEADER_OFFSET), 50);
      navigate(".", { replace: true, state: {} });
      return () => clearTimeout(t);
    }
  }, [location.pathname, pendingTarget, navigate]);

  const goToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTarget: id } });
    } else {
      scrollToId(id, HEADER_OFFSET);
    }
    setMenuOpen(false);
  };

  const routeMap = {
    Home: "/",
    Booking: "/booking",
    Articles: "/articles",
    Products: "/product",
  };

  const navItems = [
    { name: "Home" },
    { name: "Booking" },
    { name: "Gallery", scroll: "gallery-section" },
    { name: "Articles" },
    { name: "Products" },
    { name: "About Me", scroll: "about-section" },
  ];

  const handleNavClick = (item) => {
    if (item.scroll) return goToSection(item.scroll);

    const path = routeMap[item.name];
    if (!path) return; // prevents bad navigate
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <div className="bg-[#200027] shadow-md text-[#ceaa5b] sticky top-0 z-50">
      <nav className="font-sans px-4 py-3 sm:px-6 max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img
            src={logo}
            alt="Elika Beauty Logo"
            className="h-12 sm:h-16 w-auto cursor-pointer p-0.5"
            onClick={() => navigate("/")}
          />

        </div>

        <div className="sm:hidden">
          <button onClick={() => setMenuOpen((v) => !v)} className="focus:outline-none">
            {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-4">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavClick(item)}
              className="px-3 py-2 rounded-md hover:underline transition"
            >
              {item.name}
            </button>
          ))}
        </div>
      </nav>

      {menuOpen && (
        <div className="sm:hidden bg-[#200027] px-4 pb-4 text-[#ceaa5b]">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavClick(item)}
              className="block w-full text-left py-2 border-b border-[#ceaa5b]/30 hover:underline transition"
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
