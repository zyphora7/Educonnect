import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

export default function StudentMaterials() {
  const [items, setItems] = useState(null);
  useEffect(() => { api.get('/materials').then(({ data }) => setItems(data)); }, []);
  if (!items) return <Spinner />;
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {items.length === 0 && <div className="card">No materials available yet.</div>}
      {items.map((m) => (
        <div key={m._id} className="card">
          <div className="text-xs uppercase tracking-wider text-brand-600">{m.subject}</div>
          <h4 className="font-bold text-lg">{m.title}</h4>
          <p className="text-sm text-gray-700 mt-1">{m.description}</p>
          <a   href={m.link?.startsWith("http")
    ? m.link
    : `http://localhost:8000${m.link}`} target="_blank" rel="noreferrer"
             className="btn-primary mt-3 inline-block">⬇️ Download / Open</a>
             
          <div className="text-xs text-gray-500 mt-2">
            By {m.uploadedBy?.name || 'Teacher'} · {new Date(m.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}
