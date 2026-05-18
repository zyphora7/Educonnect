import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <header className="sticky top-0 z-30">
      <nav className="glass mx-4 mt-4 px-6 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-brand-600">📘 EduConnect</Link>
        <div className="flex items-center gap-3 text-sm">
          <Link to="/" className="hover:text-brand-600">Home</Link>
          <Link to="/about" className="hover:text-brand-600">About</Link>
          {!user && <Link to="/login" className="btn-ghost">Login</Link>}
          {!user && <Link to="/register" className="btn-primary">Register</Link>}
          {user && (
            <>
              <Link
                to={user.role === 'teacher' ? '/teacher' : '/student'}
                className="btn-ghost"
              >
                Dashboard
              </Link>
              <button onClick={() => { logout(); nav('/'); }} className="btn-primary">Logout</button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
