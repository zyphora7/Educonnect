// Entry point for the EduConnect backend.
// Sets up Express, middleware, routes, and starts the server after DB connects.
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');


const app = express();

// --- Global middleware ---
// app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));
app.use(express.json()); // parse JSON request bodies

// --- Health check ---
app.get('/', (req, res) => res.json({ status: 'EduConnect API running 🚀' }));

// --- Routes ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/materials', require('./routes/materialRoutes'));
app.use("/api/chat", require("./routes/chatRoutes"));
// --- Error handlers (must be last) ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;



// Connect to MongoDB first, then start listening
connectDB().then(() => {
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
});
