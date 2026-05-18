import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

export default function StudentLayout() {
  const items = [
    { to: '/student', label: 'Dashboard', icon: '🏠' },
    { to: '/student/materials', label: 'Study Materials', icon: '📚' },
    { to: '/student/profile', label: 'My Profile', icon: '👤' },
  ];
  return (
    <div className="flex flex-col md:flex-row gap-6 mt-4">
      <Sidebar items={items} />
      <div className="flex-1"><Outlet /></div>
    </div>
  );
}
