# EduConnect — MERN Stack Teacher/Student Portal

A beginner-friendly full-stack MERN app where **Teachers** manage students, study materials and reviews, and **Students** access their personal dashboard, materials and feedback.

## ✨ Features

**Teacher Dashboard**
- View / Add / Edit / Delete / Search students
- Add reviews & attendance / performance status
- Upload study materials (title, subject, description, PDF/Drive link)
- Dashboard statistics cards

**Student Dashboard**
- View profile, attendance, performance
- View teacher reviews
- View / download study materials

**Tech**
- Frontend: React 18 + Vite, Tailwind CSS, React Router DOM v6, Axios, Context API
- Backend: Node.js, Express, MongoDB Atlas, Mongoose, JWT, bcrypt
- UI: Glassmorphism, responsive, sidebar nav, toasts (react-hot-toast), spinners

---

## 📁 Folder Structure

```
educonnect/
├── backend/
│   ├── config/db.js                # MongoDB connection
│   ├── controllers/                # Route logic (MVC)
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   └── materialController.js
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT verification + role check
│   │   └── errorMiddleware.js
│   ├── models/                     # Mongoose schemas
│   │   ├── User.js
│   │   ├── Student.js
│   │   └── Material.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   └── materialRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── api/axios.js
    │   ├── components/             # Navbar, Sidebar, ProtectedRoute, Spinner
    │   ├── context/AuthContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── About.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── teacher/            # Dashboard, Students, Materials
    │   │   └── student/            # Dashboard, Materials, Profile
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    └── vite.config.js
```

---

## 🚀 Setup & Installation

### 1. Clone & install
```bash
unzip educonnect.zip && cd educonnect

# Backend
cd backend
npm install
cp .env.example .env   # then edit values

# Frontend (new terminal)
cd ../frontend
npm install
```

### 2. Configure MongoDB Atlas
1. Create a free cluster at https://cloud.mongodb.com
2. Database Access → add user with password
3. Network Access → allow `0.0.0.0/0` (dev only)
4. Connect → "Connect your application" → copy connection string
5. Paste it into `backend/.env` as `MONGO_URI`

### 3. Backend `.env`
```
PORT=5000
MONGO_URI=mongodb+srv://USER:PASS@cluster0.xxxx.mongodb.net/educonnect
JWT_SECRET=supersecretchangeme
JWT_EXPIRES=7d
CLIENT_URL=http://localhost:5173
```

### 4. Run
```bash
# terminal 1
cd backend && npm run dev      # http://localhost:5000

# terminal 2
cd frontend && npm run dev     # http://localhost:5173
```

---

## 🔐 JWT Authentication (how it works)

1. **Register / Login** → server hashes password with `bcrypt`, on success signs a JWT containing `{ id, role }` with `JWT_SECRET`.
2. JWT is returned to the frontend and stored in `localStorage` (kept in `AuthContext`).
3. Axios attaches it to every request as `Authorization: Bearer <token>`.
4. `protect` middleware verifies the token; `authorize('teacher')` restricts teacher-only routes.
5. Frontend `<ProtectedRoute role="teacher">` redirects unauthorized users.

---

## 🧪 API Testing Examples (cURL / Postman)

```bash
# Register teacher
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ms. Rao","email":"rao@test.com","password":"pass1234","role":"teacher"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rao@test.com","password":"pass1234"}'
# → returns { token, user }

# Add a student (teacher only)
curl -X POST http://localhost:5000/api/students \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Aman Verma","rollNumber":"R001","email":"aman@x.com","phone":"9999","parentContact":"8888","course":"CSE-A"}'

# List students
curl http://localhost:5000/api/students -H "Authorization: Bearer <TOKEN>"

# Upload material
curl -X POST http://localhost:5000/api/materials \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"DBMS Notes","description":"Unit 1","subject":"DBMS","link":"https://drive.google.com/..."}'
```

---

## 🌍 Deployment

### Backend → Render
1. Push repo to GitHub
2. https://render.com → New Web Service → connect repo → root `backend`
3. Build: `npm install` · Start: `npm start`
4. Add env vars (`MONGO_URI`, `JWT_SECRET`, etc.)
5. Note the URL, e.g. `https://educonnect-api.onrender.com`

### Frontend → Vercel
1. https://vercel.com → New Project → root `frontend`
2. Framework: Vite
3. Env var: `VITE_API_URL=https://educonnect-api.onrender.com/api`
4. Deploy ✅

Update CORS `CLIENT_URL` in backend to your Vercel URL.

---

## 🧠 Beginner Notes
- Code is heavily commented — start with `backend/server.js` and `frontend/src/App.jsx`.
- `Context API` (`AuthContext`) holds user + token globally.
- MVC = **M**odel (schema) + **V**iew (React) + **C**ontroller (Express handler).
- Always validate input on the server even if frontend validates.

Happy building! 🎓
