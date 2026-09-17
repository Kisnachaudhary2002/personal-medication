const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const generateToken = require("../utils/generateToken");

const GMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
const PHONE_REGEX = /^\d{10}$/;

// @route POST /api/auth/register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, age, gender, phone } = req.body;

  // Every field is required — reject early with a clear message rather than
  // letting a half-filled form reach the database.
  if (!name || !email || !password || !age || !gender || !phone) {
    res.statusCode = 400;
    throw new Error("All fields are required: name, email, password, age, gender, phone");
  }

  if (!GMAIL_REGEX.test(email)) {
    res.statusCode = 400;
    throw new Error("Email must be a valid @gmail.com address");
  }

  if (!PHONE_REGEX.test(phone)) {
    res.statusCode = 400;
    throw new Error("Phone number must be exactly 10 digits");
  }

  if (password.length < 6) {
    res.statusCode = 400;
    throw new Error("Password must be at least 6 characters");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.statusCode = 400;
    throw new Error("User with this email already exists");
  }

  // Only allow "patient" or "doctor" via public registration
  const user = await User.create({
    name,
    email,
    password,
    role: role === "doctor" ? "doctor" : "patient",
    age,
    gender,
    phone,
  });

  res.status(201).json({
    success: true,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token: generateToken(user._id, user.role),
  });
});

// @route POST /api/auth/login
// Expects { email, password, role } — role is which tab the user picked
// on the login screen ("patient" or "doctor"), and must match their account.
const loginUser = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    res.statusCode = 400;
    throw new Error("Email, password and role are required");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    res.statusCode = 401;
    throw new Error("Invalid email or password");
  }

  // Admin accounts can log in through either tab; patient/doctor must match exactly
  if (user.role !== "admin" && user.role !== role) {
    res.statusCode = 401;
    throw new Error(`This account is registered as a ${user.role}. Please log in from the ${user.role} tab.`);
  }

  res.status(200).json({
    success: true,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token: generateToken(user._id, user.role),
  });
});

// @route GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

module.exports = { registerUser, loginUser, getMe };
