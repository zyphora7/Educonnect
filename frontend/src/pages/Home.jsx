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
          and students access everything in one clean dashboard.
        </p>
        <div className="mt-6 flex gap-3">
          <Link to="/register" className="btn-primary">Get Started</Link>
          <Link to="/about" className="btn-ghost">Learn more</Link>
        </div>
      </div>
      {/* <div className="card">
        <ul className="space-y-3 text-gray-800">
          <li>👩‍🏫 Teacher & 🎓 Student logins</li>
          <li>📋 Full student CRUD + search</li>
          <li>📚 Upload & share study materials</li>
          <li>📝 Reviews, attendance, performance</li>
          <li>🔐 JWT + role-based protected routes</li>
        </ul>
      </div> */}
    </section>
  );
}
