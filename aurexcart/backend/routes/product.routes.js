const express = require('express');
const router = express.Router();
const Product = require('../models/Product.model');
const AnalyticsEvent = require('../models/Analytics.model');
const { protect, vendorOrAdmin, optionalAuth } = require('../middleware/auth.middleware');

// ─── GET /api/products ────────────────────────────────────────────────────
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, search, vendor, featured, aurex, page = 1, limit = 24, sort = '-createdAt' } = req.query;
    const filter = { status: 'active' };

    if (category) filter.category = category;
    if (vendor) filter.vendor = vendor;
    if (featured === 'true') filter.isFeatured = true;
    if (aurex === 'true') filter.isAurexLabsProduct = true;
    if (search) filter.$text = { $search: search };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [products, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(parseInt(limit)).populate('vendor', 'storeName storeSlug logo'),
      Product.countDocuments(filter),
    ]);

    res.json({ products, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/products/:slug ──────────────────────────────────────────────
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, status: 'active' })
      .populate('vendor', 'storeName storeSlug logo socialLinks brandColors');

    if (!product) return res.status(404).json({ error: 'Product not found.' });

    // Track view
    product.views += 1;
    await product.save();
    await AnalyticsEvent.create({ eventType: 'product_view', product: product._id, user: req.user?._id || null, page: req.params.slug });

    res.json({ product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/products ───────────────────────────────────────────────────
router.post('/', protect, vendorOrAdmin, async (req, res) => {
  try {
    const Vendor = require('../models/Vendor.model');
    const vendor = await Vendor.findOne({ owner: req.user._id });
    if (!vendor && req.user.role !== 'admin') return res.status(400).json({ error: 'You must have an active store to add products.' });

    const product = await Product.create({
      ...req.body,
      vendor: vendor?._id || req.body.vendor,
      vendorName: vendor?.storeName || req.body.vendorName,
    });

    // Update vendor analytics
    if (vendor) { vendor.analytics.totalProducts += 1; await vendor.save(); }

    res.status(201).json({ product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── PUT /api/products/:id ────────────────────────────────────────────────
router.put('/:id', protect, vendorOrAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });

    const Vendor = require('../models/Vendor.model');
    const vendor = await Vendor.findOne({ owner: req.user._id });
    if (req.user.role !== 'admin' && product.vendor.toString() !== vendor?._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to edit this product.' });
    }

    Object.assign(product, req.body);
    await product.save();
    res.json({ product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE /api/products/:id ─────────────────────────────────────────────
router.delete('/:id', protect, vendorOrAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });

    product.status = 'deleted';
    await product.save();
    res.json({ message: 'Product removed.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/products/:id/share ─────────────────────────────────────────
router.post('/:id/share', optionalAuth, async (req, res) => {
  try {
    const { platform } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });

    product.shareCount += 1;
    if (platform && product.sharesByPlatform[platform] !== undefined) {
      product.sharesByPlatform[platform] += 1;
    }
    await product.save();

    await AnalyticsEvent.create({ eventType: 'product_share', product: product._id, user: req.user?._id || null, sharePlatform: platform });

    res.json({ message: 'Share tracked', shareCount: product.shareCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
