import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';

import TeacherLayout from './pages/teacher/TeacherLayout';
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherStudents from './pages/teacher/Students';
import TeacherMaterials from './pages/teacher/Materials';

import StudentLayout from './pages/student/StudentLayout';
import StudentDashboard from './pages/student/Dashboard';
import StudentMaterials from './pages/student/Materials';
import StudentProfile from './pages/student/Profile';
import Chatbot from "./pages/student/Chatbot";
export default function App() {
  return (
    <>
      <Navbar />
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Teacher */}
          <Route path="/teacher" element={
            <ProtectedRoute role="teacher"><TeacherLayout /></ProtectedRoute>
          }>
            <Route index element={<TeacherDashboard />} />
            <Route path="students" element={<TeacherStudents />} />
            <Route path="materials" element={<TeacherMaterials />} />
          </Route>

          {/* Student */}
          <Route path="/student" element={
            <ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>
          }>
            <Route index element={<StudentDashboard />} />
            <Route path="materials" element={<StudentMaterials />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="/student/chatbot" element={<Chatbot />} />
          </Route>

          <Route path="*" element={<div className="card">404 — Not Found</div>} />
        </Routes>
      </main>
    </>
  );
}
