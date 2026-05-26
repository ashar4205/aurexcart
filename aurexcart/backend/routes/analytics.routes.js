// analytics.routes.js
const express = require('express');
const analyticsRouter = express.Router();
const AnalyticsEvent = require('../models/Analytics.model');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth.middleware');

analyticsRouter.post('/track', optionalAuth, async (req, res) => {
  try {
    const { eventType, productId, vendorId, sharePlatform, page, metadata } = req.body;
    await AnalyticsEvent.create({
      eventType, product: productId || null, vendor: vendorId || null,
      user: req.user?._id || null, sharePlatform, page,
      ipAddress: req.ip, userAgent: req.headers['user-agent'],
      metadata: metadata || {},
    });
    res.json({ tracked: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

analyticsRouter.get('/platform-stats', protect, adminOnly, async (req, res) => {
  try {
    const { range = '30d' } = req.query;
    const days = range === '7d' ? 7 : range === '24h' ? 1 : 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [pageViews, productViews, orders, shares] = await Promise.all([
      AnalyticsEvent.countDocuments({ eventType: 'page_view', createdAt: { $gte: since } }),
      AnalyticsEvent.countDocuments({ eventType: 'product_view', createdAt: { $gte: since } }),
      AnalyticsEvent.countDocuments({ eventType: 'order_placed', createdAt: { $gte: since } }),
      AnalyticsEvent.countDocuments({ eventType: 'product_share', createdAt: { $gte: since } }),
    ]);

    const sharesByPlatform = await AnalyticsEvent.aggregate([
      { $match: { eventType: 'product_share', createdAt: { $gte: since } } },
      { $group: { _id: '$sharePlatform', count: { $sum: 1 } } },
    ]);

    const dailyViews = await AnalyticsEvent.aggregate([
      { $match: { eventType: 'page_view', createdAt: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.json({ pageViews, productViews, orders, shares, sharesByPlatform, dailyViews });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = analyticsRouter;
