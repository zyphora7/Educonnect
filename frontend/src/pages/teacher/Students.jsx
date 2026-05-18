import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import Modal from '../../components/Modal';

const empty = {
  fullName: '', rollNumber: '', email: '', phone: '', parentContact: '',
  course: '', review: '', attendance: 0, performance: 'Average',
};

export default function Students() {
  const [list, setList] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);

  const load = async (q = '') => {
    setList(null);
    const { data } = await api.get('/students', { params: { search: q } });
    setList(data);
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (s) => { setEditing(s); setForm(s); setOpen(true); };

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/students/${editing._id}`, form);
        toast.success('Student updated');
      } else {
        await api.post('/students', form);
        toast.success('Student added');
      }
      setOpen(false); load(search);
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
  };

  const del = async (id) => {
    if (!confirm('Delete this student?')) return;
    await api.delete(`/students/${id}`);
    toast.success('Deleted'); load(search);
  };

  return (
    <div className="space-y-4">
      <div className="card flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <input className="input sm:max-w-xs" placeholder="🔍 Search by name, roll, course…"
               value={search}
               onChange={(e) => { setSearch(e.target.value); load(e.target.value); }} />
        <button onClick={openCreate} className="btn-primary">+ Add Student</button>
      </div>

      {!list ? <Spinner /> : (
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-700 border-b border-white/60">
                {['Roll', 'Name', 'Course', 'Email', 'Phone', 'Parent', 'Attd.', 'Perf.', 'Actions'].map((h) => (
                  <th key={h} className="py-2 pr-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.length === 0 && (
                <tr><td colSpan="9" className="py-6 text-center text-gray-500">No students yet</td></tr>
              )}
              {list.map((s) => (
                <tr key={s._id} className="border-b border-white/40 hover:bg-white/40">
                  <td className="py-2 pr-3 font-mono">{s.rollNumber}</td>
                  <td className="py-2 pr-3">{s.fullName}</td>
                  <td className="py-2 pr-3">{s.course}</td>
                  <td className="py-2 pr-3">{s.email}</td>
                  <td className="py-2 pr-3">{s.phone}</td>
                  <td className="py-2 pr-3">{s.parentContact}</td>
                  <td className="py-2 pr-3">{s.attendance}%</td>
                  <td className="py-2 pr-3">{s.performance}</td>
                  <td className="py-2 pr-3 space-x-2 whitespace-nowrap">
                    <button onClick={() => openEdit(s)} className="text-brand-600 hover:underline">Edit</button>
                    <button onClick={() => del(s._id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Student' : 'Add Student'}>
        <form onSubmit={save} className="grid grid-cols-2 gap-3">
          {[
            ['fullName', 'Full Name'], ['rollNumber', 'Roll Number'],
            ['email', 'Email'], ['phone', 'Phone'],
            ['parentContact', 'Parent Contact'], ['course', 'Course / Class'],
          ].map(([k, label]) => (
            <input key={k} className="input" placeholder={label} required={['fullName','rollNumber','email'].includes(k)}
                   value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
          ))}
          <input className="input" type="number" min="0" max="100" placeholder="Attendance %"
                 value={form.attendance} onChange={(e) => setForm({ ...form, attendance: +e.target.value })} />
          <select className="input" value={form.performance}
                  onChange={(e) => setForm({ ...form, performance: e.target.value })}>
            {['Excellent','Good','Average','Needs Improvement'].map((p) => <option key={p}>{p}</option>)}
          </select>
          <textarea className="input col-span-2" placeholder="Review / Feedback" rows="3"
                    value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} />
          <button className="btn-primary col-span-2">{editing ? 'Update' : 'Create'}</button>
        </form>
      </Modal>
    </div>
  );
}
