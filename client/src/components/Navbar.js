import React from "react";
import logo from "../logo2.png";
import { useNavigate, useLocation } from "react-router-dom";
import { scroller } from "react-scroll";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleScrollToAbout = () => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        scroller.scrollTo("about-section", {
          smooth: true,
          duration: 500,
          offset: -80,
        });
      }, 500);
    } else {
      scroller.scrollTo("about-section", {
        smooth: true,
        duration: 500,
        offset: -80,
      });
    }
  };

  const handleScrollToGallery = () => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        scroller.scrollTo("gallery-section", {
          smooth: true,
          duration: 500,
          offset: -80,
        });
      }, 500);
    } else {
      scroller.scrollTo("gallery-section", {
        smooth: true,
        duration: 500,
        offset: -80,
      });
    }
  };

  const routeMap = {
    Home: "/",
    Booking: "/booking",
    Products: "/product",
  };

  return (
    <div className="bg-white shadow-md sticky top-0 z-50">
      <nav className="text-purplecolor p-4 max-w-6xl flex justify-between items-center mx-auto">
        {/* Left: Logo and Studio name */}
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Beauty Shohre Studio Logo" className="h-16 w-auto" />
          <h1 className="text-xl font-bodonimoda font-bold">BEAUTY SHOHRE STUDIO</h1>
        </div>

        {/* Right: Navigation */}
        <div className="flex items-center gap-4 font-bodonimoda">
          {["Home", "Booking", "Products", "Gallery", "About Me"].map((item, index) => {
            if (item === "About Me") {
              return (
                <div
                  key={index}
                  onClick={handleScrollToAbout}
                  className="cursor-pointer px-3 py-2 rounded-md border border-transparent hover:translate-y-[-2px] hover:text-pinkcolor transition-all duration-300"
                >
                  {item}
                </div>
              );
            }

            if (item === "Gallery") {
              return (
                <div
                  key={index}
                  onClick={handleScrollToGallery}
                  className="cursor-pointer px-3 py-2 rounded-md border border-transparent hover:translate-y-[-2px] hover:text-pinkcolor transition-all duration-300"
                >
                  {item}
                </div>
              );
            }

            return (
              <div
                key={index}
                onClick={() => navigate(routeMap[item])}
                className="cursor-pointer px-3 py-2 rounded-md border border-transparent hover:translate-y-[-2px] hover:text-pinkcolor transition-all duration-300"
              >
                {item}
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
