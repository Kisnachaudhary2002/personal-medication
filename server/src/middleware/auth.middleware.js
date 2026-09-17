const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

// Verifies JWT sent in Authorization: Bearer <token> and attaches req.user
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.statusCode = 401;
    throw new Error("Not authorized, no token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      res.statusCode = 401;
      throw new Error("User no longer exists");
    }

    next();
  } catch (error) {
    res.statusCode = 401;
    throw new Error("Not authorized, token failed");
  }
});

// Restrict a route to specific roles, e.g. authorizeRoles("doctor", "admin")
const authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    res.statusCode = 403;
    throw new Error(`Role '${req.user.role}' is not allowed to access this resource`);
  }
  next();
};

module.exports = { protect, authorizeRoles };
