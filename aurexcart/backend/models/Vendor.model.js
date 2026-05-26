const mongoose = require('mongoose');
const slugify = require('slugify');

const vendorSchema = new mongoose.Schema({
  // ─── Core Identity ────────────────────────────────────────────────────────
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  storeName: { type: String, required: true, trim: true, maxlength: 100 },
  storeSlug: { type: String, unique: true },
  storeTagline: { type: String, maxlength: 200, default: '' },
  storeDescription: { type: String, maxlength: 2000, default: '' },

  // ─── Branding ─────────────────────────────────────────────────────────────
  logo: { url: String, publicId: String },
  banner: { url: String, publicId: String },
  brandColors: {
    primary: { type: String, default: '#0052FF' },
    secondary: { type: String, default: '#00D1FF' },
    background: { type: String, default: '#000000' },
  },

  // ─── Social Media ─────────────────────────────────────────────────────────
  socialLinks: {
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
    tiktok: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    website: { type: String, default: '' },
  },

  // ─── Legal Verification ───────────────────────────────────────────────────
  cnic: { type: String, required: true }, // National Identity Number
  cnicVerified: { type: Boolean, default: false },

  // ─── Payout Details ───────────────────────────────────────────────────────
  payoutMethod: { type: String, enum: ['payoneer', 'easypaisa', 'jazzcash'], required: true },
  payoutAccountNumber: { type: String, required: true },
  payoutVerified: { type: Boolean, default: false },

  // ─── Status ───────────────────────────────────────────────────────────────
  status: { type: String, enum: ['pending', 'active', 'suspended', 'rejected'], default: 'pending' },
  rejectionReason: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },

  // ─── Store Widgets/Customization ──────────────────────────────────────────
  widgets: [
    {
      type: { type: String, enum: ['announcement', 'countdown', 'featured-products', 'testimonial', 'newsletter', 'social-feed'] },
      title: String,
      content: mongoose.Schema.Types.Mixed,
      isActive: { type: Boolean, default: true },
      order: { type: Number, default: 0 },
    },
  ],

  // ─── Store SEO ────────────────────────────────────────────────────────────
  metaTitle: { type: String, maxlength: 70 },
  metaDescription: { type: String, maxlength: 160 },

  // ─── Analytics (all initialized to 0) ────────────────────────────────────
  analytics: {
    totalProducts: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
    pendingPayouts: { type: Number, default: 0 },
    completedPayouts: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },

  // ─── Commission ───────────────────────────────────────────────────────────
  commissionRate: { type: Number, default: 10 }, // Platform takes 10%

}, { timestamps: true });

vendorSchema.pre('save', async function (next) {
  if (this.isModified('storeName')) {
    let slug = slugify(this.storeName, { lower: true, strict: true });
    const existing = await mongoose.model('Vendor').findOne({ storeSlug: slug, _id: { $ne: this._id } });
    if (existing) slug = `${slug}-${Date.now()}`;
    this.storeSlug = slug;
  }
  next();
});

module.exports = mongoose.model('Vendor', vendorSchema);
