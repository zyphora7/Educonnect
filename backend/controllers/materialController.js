// Study material CRUD. Teachers create/delete; both roles can list.
const Material = require('../models/Material');
const cloudinary = require('../config/cloudinary');

exports.list = async (req, res) => {
  const items = await Material.find().sort('-createdAt').populate('uploadedBy', 'name');
  res.json(items);
};

// exports.create = async (req, res) => {
//   const { title, description, subject, link } = req.body;
//   if (!title || !subject || !link)
//     return res.status(400).json({ message: 'title, subject, link are required' });
//   const m = await Material.create({ title, description, subject, link, uploadedBy: req.user._id });
//   res.status(201).json(m);
// };

exports.create = async (req, res) => {
  try {

    const { title, description, subject } = req.body;

    if (!title || !subject || !req.file) {
      return res.status(400).json({
        message: "Title, subject and PDF required"
      });
    }

    const result =
      await cloudinary.uploader.upload(
        req.file.path,
        {
          resource_type: "raw",
          folder: "EduConnectMaterials",
          use_filename:true
        }
      );

    const m =
      await Material.create({
        title,
        description,
        subject,
        link: result.secure_url,
        uploadedBy: req.user._id
      });

    res.status(201).json(m);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.remove = async (req, res) => {
  const m = await Material.findByIdAndDelete(req.params.id);
  if (!m) return res.status(404).json({ message: 'Material not found' });
  res.json({ message: 'Deleted' });
};

