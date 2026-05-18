// // Handles registration & login for both Teachers and Students.
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// // Sign a JWT with user id + role
// const signToken = (user) =>
//   jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES || '7d',
//   });

// // POST /api/auth/register
// exports.register = async (req, res) => {
//   const { name, email, password, role } = req.body;
//   if (!name || !email || !password || !role)
//     return res.status(400).json({ message: 'All fields are required' });
//   if (!['teacher', 'student'].includes(role))
//     return res.status(400).json({ message: 'Role must be teacher or student' });

//   const exists = await User.findOne({ email });
//   if (exists) return res.status(400).json({ message: 'Email already registered' });
  
//   const user = await User.create({ name, email, password, role });
//   res.status(201).json({
//     token: signToken(user),
//     user: { id: user._id, name: user.name, email: user.email, role: user.role },
//   });
// };

// // POST /api/auth/login
// exports.login = async (req, res) => {
//   const { email, password, role } = req.body;
//   const user = await User.findOne({ email });
//   if (!user || !(await user.matchPassword(password)))
//     return res.status(401).json({ message: 'Invalid credentials' });
//   // Optional: enforce that login form role matches account role
//   if (role && user.role !== role)
//     return res.status(401).json({ message: `Not registered as ${role}` });

  
//   res.json({
//     token: signToken(user),
//     user: { id: user._id, name: user.name, email: user.email, role: user.role },
//   });
// };

// // GET /api/auth/me
// exports.me = async (req, res) => res.json(req.user);


//backend/controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Helper: generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc    Register a new user (Student OR Teacher with invite code)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, inviteCode } = req.body;

    // 1. Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 3. Decide the role safely
    //    - Default everyone to "student"
    //    - Only allow "teacher" if a valid invite code is provided
    let finalRole = "student";

    if (role === "teacher") {
      if (!inviteCode || inviteCode !== process.env.TEACHER_INVITE_CODE) {
        return res.status(403).json({
          message: "Invalid or missing teacher invite code",
        });
      }
      finalRole = "teacher";
    }

    // // 4. Hash password
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    // // 5. Create user
    // const user = await User.create({
    //   name,
    //   email,
    //   password: hashedPassword,
    //   role: finalRole,
    // });


    const user = await User.create({
      name,
      email,
      password,
      role: finalRole,
      });

    // 6. Respond with token
    res.status(201).json({
      token: generateToken(user._id, user.role),
      user:{
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      }
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3. Respond with token
    res.json({
      token: generateToken(user._id, user.role),
      user:{id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,}
      
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.me = async (req, res) => {
  res.json(req.user);
};