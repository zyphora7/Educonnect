import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const { user } = useAuth();
  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-2xl font-bold">Hi, {user?.name} 👋</h2>
        <p className="text-gray-700">Welcome to your dashboard.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Link to="/student/materials" className="card hover:scale-[1.01] transition">
          📚 <span className="font-semibold">View Study Materials</span>
        </Link>
        <Link to="/student/profile" className="card hover:scale-[1.01] transition">
          👤 <span className="font-semibold">My Profile & Feedback</span>
        </Link>
           <Link to="/student/chatbot" className="card hover:scale-[1.01] transition bg-blue-50">
          💬 <span className="font-semibold">Mental Wellness Chatbot</span>
          <p className="text-sm text-gray-600">Talk & get support anytime</p>
        
        </Link>
      </div>
    </div>
  );
}