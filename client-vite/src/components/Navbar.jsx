import { useEffect, useState } from "react";
import Logo from "./Logo"
import { useNavigate, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { scrollToId } from "../lib/scrollTo";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  const HEADER_OFFSET = 80;

  const pendingTarget = location.state?.scrollTarget;

  useEffect(() => {
    if (location.pathname === "/" && pendingTarget) {
      const t = setTimeout(() => scrollToId(pendingTarget, HEADER_OFFSET), 50);
      navigate(".", { replace: true, state: {} });
      return () => clearTimeout(t);
    }
  }, [location.pathname, pendingTarget, navigate]);


useEffect(() => {
  const onScroll = () => setScrolled(window.scrollY > 20);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}, []);


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
    Gallery: "/gallery",
  };

  const navItems = [
    { name: "Home" },
    { name: "Booking" },
    { name: "Gallery" },
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
    <div
      className={[
        "fixed top-0 left-0 right-0 z-50 transition ",
        scrolled
          ? "bg-[#F8F7F1] text-[#7a3b44]"
          : "bg-[#F8F7F1]  text-[#7a3b44]",
      ].join(" ")}
    >
      <nav className="font-theseason h-14 sm:px-6 max-w-6xl mx-auto flex justify-between items-center">
        <div
          className="cursor-pointer"
          onClick={() => navigate("/")}
        >
          <Logo size="sm" color={"#7a3b44"} />
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
        <div className="sm:hidden bg-white/60 px-4 pb-4 text-[#7a3b44]">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavClick(item)}
              className="block w-full text-left py-2 border-b border-[#7a3b44]/30 hover:text-black transition"
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
