// JWT authentication + role-based authorization.
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify token and attach user to req
const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Restrict access by role: authorize('teacher') / authorize('student')
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: `Forbidden: requires role ${roles.join(' or ')}` });
  }
  next();
};

module.exports = { protect, authorize };
