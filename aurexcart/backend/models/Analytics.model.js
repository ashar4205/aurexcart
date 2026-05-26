const mongoose = require('mongoose');

const analyticsEventSchema = new mongoose.Schema({
  // ─── Event Type ───────────────────────────────────────────────────────────
  eventType: {
    type: String,
    enum: [
      'page_view', 'product_view', 'product_share', 'add_to_cart',
      'order_placed', 'vendor_store_view', 'search', 'click',
    ],
    required: true,
  },

  // ─── References ───────────────────────────────────────────────────────────
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', default: null },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },

  // ─── Share Details ────────────────────────────────────────────────────────
  sharePlatform: {
    type: String,
    enum: ['instagram', 'facebook', 'tiktok', 'linkedin', 'copy'],
    default: null,
  },

  // ─── Session ─────────────────────────────────────────────────────────────
  sessionId: { type: String },
  ipAddress: { type: String },
  userAgent: { type: String },
  referer: { type: String, default: '' },
  page: { type: String, default: '' },

  // ─── Revenue (initialized to 0) ───────────────────────────────────────────
  revenueValue: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },

  // ─── Metadata ────────────────────────────────────────────────────────────
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },

}, { timestamps: true });

analyticsEventSchema.index({ eventType: 1, createdAt: -1 });
analyticsEventSchema.index({ product: 1 });
analyticsEventSchema.index({ vendor: 1 });

module.exports = mongoose.model('AnalyticsEvent', analyticsEventSchema);
