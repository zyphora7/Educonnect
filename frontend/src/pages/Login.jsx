import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await login(form.email, form.password, form.role);
      toast.success(`Welcome, ${u.name}`);
      nav(u.role === 'teacher' ? '/teacher' : '/student');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="card max-w-md mx-auto mt-12 space-y-4">
      <h2 className="text-2xl font-bold">Login</h2>
      <div className="flex gap-2">
        {['student', 'teacher'].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setForm({ ...form, role: r })}
            className={`flex-1 btn ${form.role === r ? 'bg-brand-600 text-white' : 'bg-white/60'}`}
          >
            {r === 'teacher' ? '👩‍🏫 Teacher' : '🎓 Student'}
          </button>
        ))}
      </div>
      <input className="input" type="email" placeholder="Email" required
             value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input className="input" type="password" placeholder="Password" required
             value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button className="btn-primary w-full" disabled={loading}>
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
      <p className="text-sm text-center">
        No account? <Link to="/register" className="text-brand-600 font-medium">Register</Link>
      </p>
    </form>
  );
}
