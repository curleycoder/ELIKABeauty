import { useParams, Link } from "react-router-dom";
import { articles } from "../data/articles";

function ArticlePage() {
  const { slug } = useParams();

  // find article by slug
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <main style={{ padding: "1.5rem" }}>
        <Link to="/">← Back</Link>
        <p>Article not found.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "1.5rem", maxWidth: "800px", margin: "0 auto" }}>
      <Link to="/">← Back to articles</Link>

      <h1 style={{ marginTop: "1rem" }}>{article.title}</h1>

      <img
        src={article.image}
        alt={article.title}
        style={{
          marginTop: "1rem",
          width: "100%",
          maxHeight: "400px",
          objectFit: "cover",
          borderRadius: "12px",
        }}
      />

      <div style={{ marginTop: "1.5rem" }}>
        {article.text.map((para, index) => (
          <p
            key={index}
            style={{ marginBottom: "0.75rem", whiteSpace: "pre-line" }}
          >
            {para}
          </p>
        ))}
      </div>
    </main>
  );
}

export default ArticlePage;

// import { useParams, Link } from "react-router-dom";
// import { articles } from "../articles";

// export default function ArticlePage() {
//   const { slug } = useParams();
//   const article = articles.find((a) => a.slug === slug);

//   if (!article) {
//     return (
//       <main className="p-4">
//         <Link to="/" className="text-blue-500">← Back</Link>
//         <p>Article not found.</p>
//       </main>
//     );
//   }

//   return (
//     <main className="p-4 max-w-3xl mx-auto">
//       <Link to="/" className="text-blue-500">← Back to articles</Link>

//       <h1 className="mt-4 text-3xl font-bold">{article.title}</h1>

//       <img
//         src={article.image}
//         alt={article.title}
//         className="mt-4 w-full max-h-96 object-cover rounded-lg"
//       />

//       <div className="mt-6 space-y-4">
//         {article.text.map((para, idx) => (
//           <p key={idx} className="leading-relaxed whitespace-pre-line">
//             {para}
//           </p>
//         ))}
//       </div>
//     </main>
//   );
// }
