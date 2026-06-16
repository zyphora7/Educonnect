// import { useEffect, useState } from 'react';
// import toast from 'react-hot-toast';
// import api from '../../api/axios';
// import Spinner from '../../components/Spinner';

// const empty = { title: '', subject: '', description: '', link: '' };

// export default function TeacherMaterials() {
//   const [items, setItems] = useState(null);
//   const [form, setForm] = useState(empty);

//   const load = async () => { const { data } = await api.get('/materials'); setItems(data); };
//   useEffect(() => { load(); }, []);

//   const submit = async (e) => {
//     e.preventDefault();
//     try { await api.post('/materials', form); toast.success('Uploaded'); setForm(empty); load(); }
//     catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
//   };
//   const del = async (id) => { await api.delete(`/materials/${id}`); toast.success('Deleted'); load(); };

//   return (
//     <div className="space-y-4">
//       <form onSubmit={submit} className="card grid sm:grid-cols-2 gap-3">
//         <input className="input" placeholder="Title" required value={form.title}
//                onChange={(e) => setForm({ ...form, title: e.target.value })} />
//         <input className="input" placeholder="Subject" required value={form.subject}
//                onChange={(e) => setForm({ ...form, subject: e.target.value })} />
//         <input className="input sm:col-span-2" placeholder="PDF / Google Drive link" required value={form.link}
//                onChange={(e) => setForm({ ...form, link: e.target.value })} />
//         <textarea className="input sm:col-span-2" placeholder="Description" rows="2" value={form.description}
//                   onChange={(e) => setForm({ ...form, description: e.target.value })} />
//         <button className="btn-primary sm:col-span-2">⬆️ Upload Material</button>
//       </form>

//       {!items ? <Spinner /> : (
//         <div className="grid md:grid-cols-2 gap-4">
//           {items.length === 0 && <div className="card">No materials yet.</div>}
//           {items.map((m) => (
//             <div key={m._id} className="card">
//               <div className="flex justify-between">
//                 <div>
//                   <div className="text-xs uppercase tracking-wider text-brand-600">{m.subject}</div>
//                   <h4 className="font-bold text-lg">{m.title}</h4>
//                 </div>
//                 <button onClick={() => del(m._id)} className="text-red-600 text-sm hover:underline">Delete</button>
//               </div>
//               <p className="text-sm text-gray-700 mt-1">{m.description}</p>
//               <a href={m.link} target="_blank" rel="noreferrer"
//                  className="btn-ghost mt-3 inline-block">📄 Open</a>
//               <div className="text-xs text-gray-500 mt-2">
//                 Uploaded {new Date(m.createdAt).toLocaleDateString()}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

const empty = {
  title: '',
  subject: '',
  description: ''
};

export default function TeacherMaterials() {
  const [items, setItems] = useState(null);
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState(null);

  const load = async () => {
    const { data } = await api.get('/materials');
    setItems(data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please select a PDF file');
      return;
    }

    try {
      const formData = new FormData();

      formData.append('title', form.title);
      formData.append('subject', form.subject);
      formData.append('description', form.description);
      formData.append('file', file);

      await api.post('/materials', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Material Uploaded');

      setForm(empty);
      setFile(null);

      load();

    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Upload failed'
      );
    }
  };

  const del = async (id) => {
    try {
      await api.delete(`/materials/${id}`);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="space-y-4">

      {/* Upload Form */}

      <form
        onSubmit={submit}
        className="card grid sm:grid-cols-2 gap-3"
      >

        <input
          className="input"
          placeholder="Title"
          required
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value
            })
          }
        />

        <input
          className="input"
          placeholder="Subject"
          required
          value={form.subject}
          onChange={(e) =>
            setForm({
              ...form,
              subject: e.target.value
            })
          }
        />

        <input
          type="file"
          accept=".pdf"
          required
          className="input sm:col-span-2"
          onChange={(e) =>
            setFile(e.target.files[0])
          }
        />

        <textarea
          className="input sm:col-span-2"
          placeholder="Description"
          rows="2"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value
            })
          }
        />

        <button
          type="submit"
          className="btn-primary sm:col-span-2"
        >
          ⬆️ Upload Material
        </button>

      </form>

      {/* Materials List */}

      {!items ? (
        <Spinner />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">

          {items.length === 0 && (
            <div className="card">
              No materials yet.
            </div>
          )}

          {items.map((m) => (
            <div
              key={m._id}
              className="card"
            >
              <div className="flex justify-between">

                <div>
                  <div className="text-xs uppercase tracking-wider text-brand-600">
                    {m.subject}
                  </div>

                  <h4 className="font-bold text-lg">
                    {m.title}
                  </h4>
                </div>

                <button
                  onClick={() => del(m._id)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Delete
                </button>

              </div>

              <p className="text-sm text-gray-700 mt-1">
                {m.description}
              </p>

              {/* <a
                href={m.link}
                target="_blank"
                // rel="noreferrer"
                rel="noopener noreferrer"
                type="application/pdf"
                className="btn-ghost mt-3 inline-block"
              >
                📄 Open PDF
              </a> */}
              <button
                onClick={() =>
                  window.open(
                    `https://docs.google.com/gview?url=${encodeURIComponent(m.link)}&embedded=true`,
                    "_blank"
                    
                  )
                }
                className="mt-3 inline-block px-4 py-2 text-sm border rounded hover:bg-gray-100"
              >
                📄 Open PDF
              </button>

              <div className="text-xs text-gray-500 mt-2">
                Uploaded{' '}
                {new Date(
                  m.createdAt
                ).toLocaleDateString()}
              </div>

              {m.uploadedBy?.name && (
                <div className="text-xs text-gray-500">
                  By {m.uploadedBy.name}
                </div>
              )}
            </div>
          ))}

        </div>
      )}
    </div>
  );
}