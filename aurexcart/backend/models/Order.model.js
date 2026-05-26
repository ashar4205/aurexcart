const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  productImage: { type: String },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  vendorName: { type: String },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, default: 0 },
  currency: { type: String, default: 'USD' },
  subtotal: { type: Number, required: true, default: 0 },
  isDigital: { type: Boolean, default: false },
  digitalFileUrl: { type: String, default: '' },
});

const orderSchema = new mongoose.Schema({
  // ─── Order Reference ──────────────────────────────────────────────────────
  orderNumber: { type: String, unique: true },

  // ─── Customer ─────────────────────────────────────────────────────────────
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String },
  customerEmail: { type: String },

  // ─── Items ────────────────────────────────────────────────────────────────
  items: [orderItemSchema],

  // ─── Pricing (all initialized to 0) ──────────────────────────────────────
  subtotal: { type: Number, default: 0 },
  shippingCost: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },

  // ─── Shipping Address ─────────────────────────────────────────────────────
  shippingAddress: {
    fullName: String,
    address: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
    phone: String,
  },

  // ─── Status ───────────────────────────────────────────────────────────────
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending',
  },

  // ─── Payment ─────────────────────────────────────────────────────────────
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  paymentMethod: { type: String, default: '' },
  paymentReference: { type: String, default: '' },

  // ─── Notes ────────────────────────────────────────────────────────────────
  customerNote: { type: String, maxlength: 500, default: '' },
  adminNote: { type: String, maxlength: 500, default: '' },

  // ─── Timestamps ───────────────────────────────────────────────────────────
  confirmedAt: Date,
  shippedAt: Date,
  deliveredAt: Date,
  cancelledAt: Date,

}, { timestamps: true });

orderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = `AC-${Date.now()}-${uuidv4().slice(0, 8).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
