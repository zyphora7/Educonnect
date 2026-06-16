export default function About() {
  return (
    <section className="card max-w-3xl mx-auto mt-8 space-y-3">
      <h2 className="text-3xl font-bold">About EduConnect</h2>
      <p>EduConnect is a beginner-friendly MERN project demonstrating role-based authentication,
         CRUD operations, and a modern glassmorphism UI — perfect for an internship/resume portfolio.</p>
      <p><strong>Stack:</strong> MongoDB, Express, React (Vite), Node.js, Tailwind CSS, JWT.</p>
      <p> <strong> EduConnect Mental Wellness Chatbot:</strong><br/>Backend <br/>
        Python with FastAPI for creating high-performance REST APIs
        Groq API for fast Large Language Model (LLM) inference
        <br/>AI & Retrieval<br/>
        Retrieval-Augmented Generation (RAG) architecture
        Sentence Transformers (all-MiniLM-L6-v2) for text embeddings
        ChromaDB for vector storage and semantic search
        Tavily Search API for retrieving relevant web information
         <br/>Data Processing<br/>
        Recursive Character Text Splitter for document chunking
        Context-aware retrieval pipeline for accurate responses</p>
    </section>
  );
}
