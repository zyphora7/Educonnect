import { Link } from 'react-router-dom';
export default function Home() {
  return (
    <section className="grid md:grid-cols-2 gap-8 items-center mt-10">
      <div>
        <h1 className="text-5xl font-extrabold leading-tight text-gray-900">
          Welcome to <span className="text-brand-600">EduConnect</span>
        </h1>
        <p className="mt-4 text-lg text-gray-700">
          A modern portal where teachers manage students, share study materials, and provide feedback —
          and students access everything in one clean dashboard and an AI-powered assistant is designed to provide students with a safe and supportive space to discuss their concerns, manage stress, and access helpful mental wellness resources. Using advanced Natural Language Processing (NLP), Retrieval-Augmented Generation (RAG), and Large Language Models (LLMs), the chatbot delivers personalized and context-aware responses. It can answer questions, offer guidance, and provide relevant information while maintaining a friendly and engaging conversational experience.

Our goal is to make mental wellness support more accessible, helping students feel heard, informed, and empowered whenever they need assistance.
        </p>
        <div className="mt-6 flex gap-3">
          <Link to="/register" className="btn-primary">Get Started</Link>
          <Link to="/about" className="btn-ghost">Learn more</Link>
        </div>
      </div>
      <div className="card">
        <ul className="space-y-3 text-gray-800">
          <li>👩‍🏫 Teacher & 🎓 Student logins</li>
          <li>📋 Full student CRUD + search</li>
          <li>📚 Upload & share study materials</li>
          <li>📝 Reviews, attendance, performance</li>
          <li>🔐 JWT + role-based protected routes</li>
          <li> 🤖 AI-Powered Mental Wellness Chatbot</li>
        </ul>
      </div>
    </section>
  );
}
