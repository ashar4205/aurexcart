const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewerName: { type: String },
  reviewerAvatar: { type: String },

  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, maxlength: 100, default: '' },
  body: { type: String, maxlength: 2000, required: true },

  // ─── Media ────────────────────────────────────────────────────────────────
  images: [{ url: String, publicId: String }],
  videoUrl: { type: String, default: '' },

  // ─── Moderation ───────────────────────────────────────────────────────────
  isVerifiedPurchase: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: true },
  isFlagged: { type: Boolean, default: false },

  // ─── Reactions ────────────────────────────────────────────────────────────
  helpfulVotes: { type: Number, default: 0 },
  helpfulVoters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // ─── Vendor Response ──────────────────────────────────────────────────────
  vendorResponse: {
    text: { type: String, default: '' },
    respondedAt: Date,
  },

}, { timestamps: true });

reviewSchema.index({ product: 1, reviewer: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
