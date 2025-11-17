import React from "react";
import { Link } from "react-router-dom";

export default function ArticleCard({ article }) {
  const { image, title, text, slug, intro } = article;

  // use intro if available, otherwise first paragraph as preview
  const preview =
    intro || (Array.isArray(text) && text.length > 0 ? text[0] : "");

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-md border border-pink-100 mx-auto">
      <img src={image} alt={title} className="w-full h-48 object-cover" />

      <div className="p-4 text-purplecolor">
        <h3 className="text-lg sm:text-xl font-semibold mb-3">{title}</h3>

        <p className="text-sm text-gray-700 mb-3 line-clamp-4">
          {preview}
        </p>

        <Link
          to={`/articles/${slug}`}
          className="text-sm text-blue-600 font-semibold hover:underline"
        >
          Read More →
        </Link>
      </div>
    </div>
  );
}




// import React, { useState } from "react";


// export default function ArticleCard({ title, text, image }) {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const toggleText = () => setIsExpanded(!isExpanded);

//   return (
//     <div className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-md border border-pink-100 mx-auto">
//       <img src={image} alt={title} className="w-full h-48 object-cover" />

//       <div className="p-4 text-purplecolor">
//         <h3 className="text-lg sm:text-xl font-semibold mb-4">{title}</h3>

//         <div className="text-sm text-gray-700 space-y-3 mb-3">
//           {(isExpanded ? text : text.slice(0, 2)).map((para, index) => (
//             <p key={index}>{para}</p>
//           ))}
//         </div>

//         <button
//           onClick={toggleText}
//           className="text-sm text-blue-600 font-semibold hover:underline focus:outline-none"
//         >
//           {isExpanded ? "Show Less" : "Read More"}
//         </button>
//       </div>
//     </div>
//   );
// }
