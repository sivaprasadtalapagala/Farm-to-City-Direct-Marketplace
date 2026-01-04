const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

// 1️⃣ Read token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

// 2️⃣ Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

// 3️⃣ Get user from DB (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
};

/**
 * Role-based access control
 * Usage: authorize('admin') or authorize('admin', 'farmer')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied for role: ${req.user.role}`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
