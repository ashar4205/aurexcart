const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

// ─── Verify JWT Token ─────────────────────────────────────────────────────
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Not authorized. No token.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id).select('-password');
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'User not found or deactivated.' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please log in again.' });
    }
    return res.status(401).json({ error: 'Invalid token.' });
  }
};

// ─── Require Admin Role ───────────────────────────────────────────────────
const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }
  next();
};

// ─── Require Vendor or Admin Role ─────────────────────────────────────────
const vendorOrAdmin = (req, res, next) => {
  if (!['vendor', 'admin'].includes(req.user?.role)) {
    return res.status(403).json({ error: 'Vendor or Admin access required.' });
  }
  next();
};

// ─── Optional Auth (doesn't block if no token) ────────────────────────────
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (user?.isActive) req.user = user;
    }
  } catch (_) {
    // Silently continue without auth
  }
  next();
};

module.exports = { protect, adminOnly, vendorOrAdmin, optionalAuth };
