const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor.model');
const User = require('../models/User.model');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// ─── GET /api/vendors ─────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const vendors = await Vendor.find({ status: 'active' })
      .select('storeName storeSlug logo banner storeTagline analytics.totalProducts analytics.averageRating')
      .limit(50);
    res.json({ vendors });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── GET /api/vendors/:slug ───────────────────────────────────────────────
router.get('/:slug', async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ storeSlug: req.params.slug, status: 'active' })
      .populate('owner', 'name avatar');
    if (!vendor) return res.status(404).json({ error: 'Store not found.' });
    res.json({ vendor });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── POST /api/vendors/create ─────────────────────────────────────────────
router.post('/create', protect, async (req, res) => {
  try {
    const existing = await Vendor.findOne({ owner: req.user._id });
    if (existing) return res.status(400).json({ error: 'You already have a store.' });

    const { storeName, storeTagline, storeDescription, cnic, payoutMethod, payoutAccountNumber, socialLinks } = req.body;

    if (!storeName || !cnic || !payoutMethod || !payoutAccountNumber) {
      return res.status(400).json({ error: 'Store name, CNIC, and payout info are required.' });
    }

    const vendor = await Vendor.create({
      owner: req.user._id,
      storeName, storeTagline, storeDescription,
      cnic, payoutMethod, payoutAccountNumber,
      socialLinks: socialLinks || {},
    });

    await User.findByIdAndUpdate(req.user._id, { role: 'vendor', vendorStore: vendor._id });

    res.status(201).json({ message: 'Store created! Pending admin approval.', vendor });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── PATCH /api/vendors/my-store ─────────────────────────────────────────
router.patch('/my-store', protect, async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ owner: req.user._id });
    if (!vendor) return res.status(404).json({ error: 'Store not found.' });

    const allowed = ['storeName', 'storeTagline', 'storeDescription', 'socialLinks', 'brandColors', 'widgets', 'metaTitle', 'metaDescription', 'logo', 'banner'];
    allowed.forEach(field => {
      if (req.body[field] !== undefined) vendor[field] = req.body[field];
    });
    await vendor.save();

    res.json({ vendor });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── GET /api/vendors/my-store/dashboard ─────────────────────────────────
router.get('/my-store/dashboard', protect, async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ owner: req.user._id });
    if (!vendor) return res.status(404).json({ error: 'No store found.' });

    const Product = require('../models/Product.model');
    const Order = require('../models/Order.model');

    const products = await Product.find({ vendor: vendor._id, status: { $ne: 'deleted' } }).select('name price stock views totalOrders averageRating images status');
    const recentOrders = await Order.find({ 'items.vendor': vendor._id }).sort('-createdAt').limit(10).populate('customer', 'name email');

    res.json({ vendor, products, recentOrders });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── PATCH /api/vendors/:id/status (Admin) ────────────────────────────────
router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { status, rejectionReason: rejectionReason || '', isVerified: status === 'active' },
      { new: true }
    );
    if (!vendor) return res.status(404).json({ error: 'Vendor not found.' });
    res.json({ vendor });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
