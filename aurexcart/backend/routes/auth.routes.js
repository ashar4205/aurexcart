const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User.model');
const { protect } = require('../middleware/auth.middleware');

// ─── Helper: Sign JWT ─────────────────────────────────────────────────────
const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// ─── POST /api/auth/register ──────────────────────────────────────────────
router.post('/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { name, email, password } = req.body;
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ error: 'Email already registered.' });

      const user = await User.create({ name, email, password, authProvider: 'local' });
      const token = signToken(user._id);

      res.status(201).json({
        message: 'Account created successfully',
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ─── POST /api/auth/login ─────────────────────────────────────────────────
router.post('/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).select('+password');
      if (!user || !user.password) return res.status(401).json({ error: 'Invalid credentials.' });

      const isMatch = await user.comparePassword(password);
      if (!isMatch) return res.status(401).json({ error: 'Invalid credentials.' });

      if (!user.isActive) return res.status(403).json({ error: 'Account suspended.' });

      const token = signToken(user._id);
      res.json({
        message: 'Login successful',
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, currency: user.currency, theme: user.theme },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ─── POST /api/auth/admin-login ───────────────────────────────────────────
router.post('/admin-login', async (req, res) => {
  const { username, password } = req.body;
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    let admin = await User.findOne({ email: 'ashar@aurexlabs.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Ashar — Aurex Labs',
        email: 'ashar@aurexlabs.com',
        password: process.env.ADMIN_PASSWORD,
        role: 'admin',
        authProvider: 'local',
        isEmailVerified: true,
      });
    }
    const token = signToken(admin._id);
    return res.json({ message: 'Admin login successful', token, user: { id: admin._id, name: admin.name, role: 'admin' } });
  }
  res.status(401).json({ error: 'Invalid admin credentials.' });
});

// ─── POST /api/auth/firebase-login ───────────────────────────────────────
router.post('/firebase-login', async (req, res) => {
  try {
    const { uid, email, name, avatar } = req.body;
    if (!uid || !email) return res.status(400).json({ error: 'Firebase UID and email required.' });

    let user = await User.findOne({ $or: [{ firebaseUid: uid }, { email }] });
    if (!user) {
      user = await User.create({ name: name || 'User', email, firebaseUid: uid, avatar: avatar || '', authProvider: 'google' });
    } else {
      user.firebaseUid = uid;
      if (avatar) user.avatar = avatar;
      await user.save();
    }

    const token = signToken(user._id);
    res.json({
      message: 'Firebase login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, currency: user.currency, theme: user.theme },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────
router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user._id).populate('vendorStore', 'storeName storeSlug status');
  res.json({ user });
});

// ─── PATCH /api/auth/preferences ─────────────────────────────────────────
router.patch('/preferences', protect, async (req, res) => {
  const { currency, theme, socialLinks } = req.body;
  const update = {};
  if (currency) update.currency = currency;
  if (theme) update.theme = theme;
  if (socialLinks) update.socialLinks = socialLinks;

  const user = await User.findByIdAndUpdate(req.user._id, update, { new: true });
  res.json({ user });
});

module.exports = router;
