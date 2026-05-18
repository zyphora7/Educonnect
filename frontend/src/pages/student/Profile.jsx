import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import { useAuth } from '../../context/AuthContext';

export default function StudentProfile() {
  const { user } = useAuth();
  const [me, setMe] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get('/students/me').then(({ data }) => setMe(data))
       .catch((e) => setErr(e.response?.data?.message || 'Failed'));
  }, []);

  if (err) return (
    <div className="card">
      <p className="text-gray-700">{err}</p>
      <p className="text-sm text-gray-500 mt-2">
        Ask your teacher to add you as a student using the same email: <b>{user?.email}</b>
      </p>
    </div>
  );
  if (!me) return <Spinner />;

  const rows = [
    ['Full Name', me.fullName], ['Roll Number', me.rollNumber],
    ['Email', me.email], ['Phone', me.phone], ['Parent Contact', me.parentContact],
    ['Course / Class', me.course], ['Attendance', me.attendance + '%'],
    ['Performance', me.performance],
  ];
  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">My Profile</h2>
        <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between border-b border-white/40 py-1">
              <dt className="text-gray-600">{k}</dt><dd className="font-medium">{v || '—'}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="card">
        <h3 className="font-semibold mb-2">📝 Teacher Review</h3>
        <p className="text-gray-800 whitespace-pre-wrap">{me.review || 'No review yet.'}</p>
      </div>
    </div>
  );
}
