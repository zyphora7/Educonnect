// import { useEffect, useState } from 'react';
// import api from '../../api/axios';
// import Spinner from '../../components/Spinner';

// export default function StudentMaterials() {
//   const [items, setItems] = useState(null);
//   const [question, setQuestion] = useState("");
//   const [selectedPdf, setSelectedPdf] = useState(null);
//   const [answer, setAnswer] = useState("");
//   const [loading, setLoading] = useState(false);
//   useEffect(() => { api.get('/materials').then(({ data }) => setItems(data)); }, []);
//   const handleAskAI = async (pdfUrl, title) => {
//   setSelectedPdf({ pdfUrl, title });
// };

//   if (!items) return <Spinner />;
//   return (
//     <div className="grid md:grid-cols-2 gap-4">
//       {items.length === 0 && <div className="card">No materials available yet.</div>}
//       {items.map((m) => (
//         <div key={m._id} className="card">
//           <div className="text-xs uppercase tracking-wider text-brand-600">{m.subject}</div>
//           <h4 className="font-bold text-lg">{m.title}</h4>
//           <p className="text-sm text-gray-700 mt-1">{m.description}</p>
          
//           <button
//                 onClick={() =>
//                   window.open(
//                     `https://docs.google.com/gview?url=${encodeURIComponent(m.link)}&embedded=true`,
//                     "_blank"
                    
//                   )
//                 }
//                 className="btn-primary mt-3 inline-block"
//               >
//                 📄 Open PDF
//               </button>
//           <button
//               onClick={() => handleAskAI(m.link, m.title)}
//               className="btn-primary mt-3 inline-block"
//             >
//               🤖 Ask AI about this
//             </button>
            
             
//           <div className="text-xs text-gray-500 mt-2">
//             By {m.uploadedBy?.name || 'Teacher'} · {new Date(m.createdAt).toLocaleDateString()}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import api from "../../api/axios";
import Spinner from "../../components/Spinner";

export default function StudentMaterials() {
  const [items, setItems] = useState(null);

  const [question, setQuestion] = useState("");
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/materials").then(({ data }) => setItems(data));
  }, []);

  const handleAskAI = (pdfUrl, title) => {
    setSelectedPdf({ pdfUrl, title });
    setQuestion("");
    setAnswer("");
  };

  const askQuestion = async () => {
    if (!selectedPdf || !question) return;

    try {
      setLoading(true);

      const res = await api.post("/chat/pdf", {
        pdfUrl: selectedPdf.pdfUrl,
        question,
      });

      setAnswer(res.data.answer);
    } catch (err) {
      console.error(err);
      setAnswer("Error getting response");
    } finally {
      setLoading(false);
    }
  };

  if (!items) return <Spinner />;

  return (
    <div className="grid md:grid-cols-2 gap-4">

      {/* MATERIAL LIST */}
      {items.length === 0 && (
        <div className="card">No materials available yet.</div>
      )}

      {items.map((m) => (
        <div key={m._id} className="card">
          <div className="text-xs uppercase tracking-wider text-brand-600">
            {m.subject}
          </div>

          <h4 className="font-bold text-lg">{m.title}</h4>

          <p className="text-sm text-gray-700 mt-1">
            {m.description}
          </p>

          {/* OPEN PDF */}
          <button
            onClick={() =>
              window.open(
                `https://docs.google.com/gview?url=${encodeURIComponent(
                  m.link
                )}&embedded=true`,
                "_blank"
              )
            }
            className="btn-primary mt-3"
          >
            📄 Open PDF
          </button>

          {/* ASK AI */}
          <button
            onClick={() => handleAskAI(m.link, m.title)}
            className="btn-primary mt-3 ml-2"
          >
            🤖 Ask AI
          </button>

          <div className="text-xs text-gray-500 mt-2">
            By {m.uploadedBy?.name || "Teacher"} ·{" "}
            {new Date(m.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}

      {/* CHAT BOX (IMPORTANT - MUST BE INSIDE RETURN) */}
      {selectedPdf && (
        <div className="card mt-4 col-span-2">
          <h3 className="font-bold">
            Ask AI about: {selectedPdf.title}
          </h3>

          <input
            className="border p-2 w-full mt-2"
            placeholder="Type your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <button
            className="btn-primary mt-2"
            onClick={askQuestion}
          >
            Ask
          </button>

          {loading && <p className="mt-2">Thinking...</p>}

          {answer && (
            <div className="mt-3 p-2 bg-gray-100 rounded">
              🤖 {answer}
            </div>
          )}
        </div>
      )}
    </div>
  );
}