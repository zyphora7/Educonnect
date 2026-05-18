// Student record managed by teachers.
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    rollNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true, lowercase: true },
    phone: String,
    parentContact: String,
    course: String, // course / class name
    review: { type: String, default: '' },
    attendance: { type: Number, default: 0, min: 0, max: 100 }, // percentage
    performance: {
      type: String,
      enum: ['Excellent', 'Good', 'Average', 'Needs Improvement'],
      default: 'Average',
    },
    // The teacher who added this student
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
