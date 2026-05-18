import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

export default function TeacherDashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get('/students/stats/summary').then(({ data }) => setStats(data)); }, []);
  if (!stats) return <Spinner />;
  const cards = [
    { label: 'Total Students', value: stats.totalStudents, icon: '👥' },
    { label: 'Excellent', value: stats.excellentCount, icon: '🏆' },
    { label: 'Avg. Attendance', value: stats.averageAttendance + '%', icon: '📈' },
  ];
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="card flex items-center gap-4">
          <div className="text-4xl">{c.icon}</div>
          <div>
            <div className="text-sm text-gray-600">{c.label}</div>
            <div className="text-3xl font-bold">{c.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
