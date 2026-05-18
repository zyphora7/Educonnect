// Study material CRUD. Teachers create/delete; both roles can list.
const Material = require('../models/Material');

exports.list = async (req, res) => {
  const items = await Material.find().sort('-createdAt').populate('uploadedBy', 'name');
  res.json(items);
};

exports.create = async (req, res) => {
  const { title, description, subject, link } = req.body;
  if (!title || !subject || !link)
    return res.status(400).json({ message: 'title, subject, link are required' });
  const m = await Material.create({ title, description, subject, link, uploadedBy: req.user._id });
  res.status(201).json(m);
};

exports.remove = async (req, res) => {
  const m = await Material.findByIdAndDelete(req.params.id);
  if (!m) return res.status(404).json({ message: 'Material not found' });
  res.json({ message: 'Deleted' });
};
