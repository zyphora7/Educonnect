// Study material uploaded by teachers, viewable by students.
const mongoose = require('mongoose');
const materialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    subject: { type: String, required: true },
    link: { type: String, required: true }, // PDF / Google Drive URL
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true } // createdAt acts as "date uploaded"
);

module.exports = mongoose.model('Material', materialSchema);

