import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

export default function TeacherLayout() {
  const items = [
    { to: '/teacher', label: 'Dashboard', icon: '📊' },
    { to: '/teacher/students', label: 'Students', icon: '🎓' },
    { to: '/teacher/materials', label: 'Materials', icon: '📚' },
  ];
  return (
    <div className="flex flex-col md:flex-row gap-6 mt-4">
      <Sidebar items={items} />
      <div className="flex-1"><Outlet /></div>
    </div>
  );
}
