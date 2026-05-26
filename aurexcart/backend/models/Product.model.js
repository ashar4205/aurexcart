const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
  // ─── Core Identity ────────────────────────────────────────────────────────
  name: { type: String, required: true, trim: true, maxlength: 200 },
  slug: { type: String, unique: true },
  description: { type: String, required: true, maxlength: 5000 },
  shortDescription: { type: String, maxlength: 300 },

  // ─── Pricing (initialized to 0) ───────────────────────────────────────────
  price: { type: Number, required: true, min: 0, default: 0 },
  comparePrice: { type: Number, default: 0 },
  discountPercent: { type: Number, default: 0 },

  // ─── Currency ────────────────────────────────────────────────────────────
  currency: { type: String, default: 'USD' },

  // ─── Category ────────────────────────────────────────────────────────────
  category: {
    type: String,
    required: true,
    enum: [
      'digital-products',
      'arts',
      'illustrations',
      'electronics-used',
      'fashion',
      'home-decor',
      'books',
      'music',
      'photography',
      'software',
      'templates',
      'aurex-labs',
      'other',
    ],
  },
  subcategory: { type: String, default: '' },
  tags: [{ type: String, trim: true }],

  // ─── Media ────────────────────────────────────────────────────────────────
  images: [{ url: String, publicId: String, alt: String }],
  thumbnail: { url: String, publicId: String },
  model3d: { url: String, publicId: String, format: String }, // Three.js model
  videoUrl: { type: String, default: '' },

  // ─── Vendor ───────────────────────────────────────────────────────────────
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  vendorName: { type: String }, // Denormalized for performance

  // ─── Inventory ───────────────────────────────────────────────────────────
  stock: { type: Number, default: 0, min: 0 },
  isDigital: { type: Boolean, default: false },
  digitalFileUrl: { type: String, default: '' },
  trackInventory: { type: Boolean, default: true },
  lowStockThreshold: { type: Number, default: 5 },

  // ─── Status ───────────────────────────────────────────────────────────────
  status: { type: String, enum: ['draft', 'active', 'paused', 'deleted'], default: 'active' },
  isFeatured: { type: Boolean, default: false },
  isAurexLabsProduct: { type: Boolean, default: false },

  // ─── SEO ─────────────────────────────────────────────────────────────────
  metaTitle: { type: String, maxlength: 70 },
  metaDescription: { type: String, maxlength: 160 },
  metaKeywords: [String],

  // ─── Analytics (initialized to 0) ────────────────────────────────────────
  views: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
  shareCount: { type: Number, default: 0 },
  sharesByPlatform: {
    instagram: { type: Number, default: 0 },
    facebook: { type: Number, default: 0 },
    tiktok: { type: Number, default: 0 },
    linkedin: { type: Number, default: 0 },
  },

  // ─── Rating ───────────────────────────────────────────────────────────────
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },

  // ─── Shipping ────────────────────────────────────────────────────────────
  shippingInfo: {
    weight: { type: Number, default: 0 },
    dimensions: {
      length: { type: Number, default: 0 },
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
    },
    freeShipping: { type: Boolean, default: false },
    shippingCost: { type: Number, default: 0 },
  },

}, { timestamps: true });

// ─── Auto-generate slug ────────────────────────────────────────────────────
productSchema.pre('save', async function (next) {
  if (this.isModified('name')) {
    let slug = slugify(this.name, { lower: true, strict: true });
    const existing = await mongoose.model('Product').findOne({ slug, _id: { $ne: this._id } });
    if (existing) slug = `${slug}-${Date.now()}`;
    this.slug = slug;
  }
  next();
});

// ─── Update average rating ─────────────────────────────────────────────────
productSchema.methods.updateRating = async function (newRating, oldRating = null) {
  if (oldRating !== null) {
    const totalScore = this.averageRating * this.reviewCount - oldRating + newRating;
    this.averageRating = totalScore / this.reviewCount;
  } else {
    const totalScore = this.averageRating * this.reviewCount + newRating;
    this.reviewCount += 1;
    this.averageRating = totalScore / this.reviewCount;
  }
  return this.save();
};

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ vendor: 1 });
productSchema.index({ slug: 1 });

module.exports = mongoose.model('Product', productSchema);
