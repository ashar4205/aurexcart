const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // ─── Identity ──────────────────────────────────────────────────────────────
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, select: false },
  avatar: { type: String, default: '' },

  // ─── Auth Provider ────────────────────────────────────────────────────────
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  googleId: { type: String, default: '' },
  firebaseUid: { type: String, default: '' },

  // ─── Role ─────────────────────────────────────────────────────────────────
  role: { type: String, enum: ['user', 'vendor', 'admin'], default: 'user' },

  // ─── Preferences ──────────────────────────────────────────────────────────
  currency: { type: String, default: 'USD' },
  theme: { type: String, enum: ['dark', 'light', 'gradient-blue', 'gradient-purple'], default: 'dark' },
  language: { type: String, default: 'en' },

  // ─── Social Links ─────────────────────────────────────────────────────────
  socialLinks: {
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
    tiktok: { type: String, default: '' },
    linkedin: { type: String, default: '' },
  },

  // ─── Vendor Reference ─────────────────────────────────────────────────────
  vendorStore: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', default: null },

  // ─── Cart ─────────────────────────────────────────────────────────────────
  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1, min: 1 },
      addedAt: { type: Date, default: Date.now },
    },
  ],

  // ─── Wishlist ─────────────────────────────────────────────────────────────
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],

  // ─── Verification ────────────────────────────────────────────────────────
  isEmailVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },

  // ─── Stats ────────────────────────────────────────────────────────────────
  totalOrders: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 }, // Always initialized to 0

}, { timestamps: true });

// ─── Hash Password Before Save ─────────────────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ─── Compare Password ──────────────────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// ─── Virtual: isVendor ─────────────────────────────────────────────────────
userSchema.virtual('isVendor').get(function () {
  return this.role === 'vendor' || this.role === 'admin';
});

module.exports = mongoose.model('User', userSchema);
