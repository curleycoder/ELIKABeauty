import React from "react"
import { Link } from "react-router-dom"
import logo from "../logo2.png"

export default function Navbar(){
    return(
        // <div className="bg-white shadow-md">
        //     <nav className="text-purplecolor p-4 max-w-6xl flex justify-between items-center mx-auto">
        //         <div className="flex items-center space-x-4">
        //             <img src={logo} alt="Beauty Shohre Studio Logo" className="h-16 w-auto" />
        //             <h1 className="text-xl font-bodonimoda font-bold">BEAUTY SHOHRE STUDIO</h1>
        //         </div>
        //         <div className="font-bodonimoda space-x-6">
        //             <Link to="/" className="hover:text-pinkcolor transition-colors duration-300">Home</Link>
        //             <Link to="/booking" className="hover:text-pinkcolor transition-colors duration-300">Booking</Link>
        //             <Link to="/product" className="hover:text-pinkcolor transition-colors duration-300">Products</Link>
        //             <Link to="/about" className="hover:text-pinkcolor transition-colors duration-300">About Me</Link>
        //         </div>
        //     </nav>
        // </div>
        <div className="bg-white shadow-md sticky top-0 z-50">
      <nav className="text-purplecolor p-4 max-w-6xl flex justify-between items-center mx-auto">

        <div className="flex items-center space-x-4">
          <img src={logo} alt="Beauty Shohre Studio Logo" className="h-16 w-auto" />
          <h1 className="text-xl font-bodonimoda font-bold">BEAUTY SHOHRE STUDIO</h1>
        </div>

      
        <div className="font-bodonimoda space-x-4">
          {["Home", "Booking", "Products", "About Me"].map((item, index) => {
            const route = item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "")}`;
            return (
              <Link
                key={index}
                to={route}
                className="px-3 py-2 rounded-md border border-transparent hover:border-[#55203d] hover:bg-[#55203d] hover:text-white transition-all duration-300"
              >
                {item}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
    )
}
