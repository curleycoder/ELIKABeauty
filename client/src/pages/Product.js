import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Product() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("/products.json")
      .then(res => setProducts(res.data))
      .catch(err => console.error("Failed to load products:", err));
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-800 pt-10 px-4 mb-20 font-bodonimoda">
      <div className="text-center">
        <h2 className="text-3xl text-purplecolor mb-6">
          <span className="border-t border-b border-gray-300 px-6">Products</span>
        </h2>
        <p className=" mb-8 text-sm text-gray-600 text-center italic">
          Please check for availability — if out of stock, we’ll restock it with your order.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {products.map(product => (
          <div
            key={product._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-4 border border-purplecolor/20"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-xl"
            />
            <h2 className="text-lg font-semibold mt-4 text-purplecolor">{product.name}</h2>
            <p className="text-sm text-gray-600 mt-1">{product.description}</p>
            <p className="text-pinkcolor font-bold mt-2">${product.price}</p>
            
          </div>
        ))}
      </div>
    </div>
  );
}
