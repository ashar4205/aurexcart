const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const Vendor = require('../models/Vendor.model');
const Product = require('../models/Product.model');
const Order = require('../models/Order.model');
const Review = require('../models/Review.model');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// ─── Platform Overview ────────────────────────────────────────────────────
router.get('/overview', async (req, res) => {
  try {
    const [totalUsers, totalVendors, totalProducts, totalOrders] = await Promise.all([
      User.countDocuments({ role: { $ne: 'admin' } }),
      Vendor.countDocuments(),
      Product.countDocuments({ status: 'active' }),
      Order.countDocuments(),
    ]);

    const revenueAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } }
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    const pendingVendors = await Vendor.countDocuments({ status: 'pending' });
    const recentOrders = await Order.find().sort('-createdAt').limit(10).populate('customer', 'name email');
    const recentUsers = await User.find().sort('-createdAt').limit(10).select('name email role createdAt');

    res.json({ totalUsers, totalVendors, totalProducts, totalOrders, totalRevenue, pendingVendors, recentOrders, recentUsers });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── All Users ────────────────────────────────────────────────────────────
router.get('/users', async (req, res) => {
  const { page = 1, limit = 20, role } = req.query;
  const filter = role ? { role } : {};
  const users = await User.find(filter).sort('-createdAt').skip((page - 1) * limit).limit(parseInt(limit));
  const total = await User.countDocuments(filter);
  res.json({ users, total });
});

router.patch('/users/:id', async (req, res) => {
  const { isActive, role } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { isActive, role }, { new: true });
  res.json({ user });
});

// ─── All Vendors ──────────────────────────────────────────────────────────
router.get('/vendors', async (req, res) => {
  const vendors = await Vendor.find().sort('-createdAt').populate('owner', 'name email');
  res.json({ vendors });
});

// ─── All Products ─────────────────────────────────────────────────────────
router.get('/products', async (req, res) => {
  const products = await Product.find({ status: { $ne: 'deleted' } }).sort('-createdAt').limit(100).populate('vendor', 'storeName');
  res.json({ products });
});

router.patch('/products/:id/feature', async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { isFeatured: req.body.isFeatured }, { new: true });
  res.json({ product });
});

// ─── All Orders ───────────────────────────────────────────────────────────
router.get('/orders', async (req, res) => {
  const orders = await Order.find().sort('-createdAt').limit(100).populate('customer', 'name email');
  res.json({ orders });
});

router.patch('/orders/:id/status', async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json({ order });
});

// ─── Reviews ─────────────────────────────────────────────────────────────
router.get('/reviews', async (req, res) => {
  const reviews = await Review.find().sort('-createdAt').limit(50).populate('reviewer', 'name').populate('product', 'name');
  res.json({ reviews });
});

module.exports = router;
