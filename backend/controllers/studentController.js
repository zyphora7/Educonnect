// CRUD + search for student records (teacher-only).
const Student = require('../models/Student');

// GET /api/students?search=...
exports.list = async (req, res) => {
  const { search = '' } = req.query;
  const q = search
    ? {
        $or: [
          { fullName: { $regex: search, $options: 'i' } },
          { rollNumber: { $regex: search, $options: 'i' } },
          { course: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      }
    : {};
  const students = await Student.find(q).sort('-createdAt');
  res.json(students);
};

// GET /api/students/:id
exports.getOne = async (req, res) => {
  const s = await Student.findById(req.params.id);
  if (!s) return res.status(404).json({ message: 'Student not found' });
  res.json(s);
};

// GET /api/students/me  (student fetching their own record by email)
exports.getMine = async (req, res) => {
  const s = await Student.findOne({ email: req.user.email });
  if (!s) return res.status(404).json({ message: 'No student record found for your account' });
  res.json(s);
};

// POST /api/students
exports.create = async (req, res) => {
  const exists = await Student.findOne({ rollNumber: req.body.rollNumber });
  if (exists) return res.status(400).json({ message: 'Roll number already exists' });
  const s = await Student.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json(s);
};

// PUT /api/students/:id
exports.update = async (req, res) => {
  const s = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!s) return res.status(404).json({ message: 'Student not found' });
  res.json(s);
};

// DELETE /api/students/:id
exports.remove = async (req, res) => {
  const s = await Student.findByIdAndDelete(req.params.id);
  if (!s) return res.status(404).json({ message: 'Student not found' });
  res.json({ message: 'Deleted' });
};

// GET /api/students/stats/summary  → dashboard cards
exports.stats = async (req, res) => {
  const total = await Student.countDocuments();
  const excellent = await Student.countDocuments({ performance: 'Excellent' });
  const avgAttendanceAgg = await Student.aggregate([
    { $group: { _id: null, avg: { $avg: '$attendance' } } },
  ]);
  res.json({
    totalStudents: total,
    excellentCount: excellent,
    averageAttendance: Math.round(avgAttendanceAgg[0]?.avg || 0),
  });
};
