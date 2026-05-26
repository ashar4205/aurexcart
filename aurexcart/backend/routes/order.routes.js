// ============================================================
// order.routes.js
// ============================================================
const express = require('express');
const orderRouter = express.Router();
const Order = require('../models/Order.model');
const Product = require('../models/Product.model');
const User = require('../models/User.model');
const { protect, adminOnly } = require('../middleware/auth.middleware');

orderRouter.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, customerNote, currency } = req.body;
    if (!items || !items.length) return res.status(400).json({ error: 'No items in order.' });

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || product.status !== 'active') return res.status(400).json({ error: `Product unavailable: ${item.productId}` });
      if (product.trackInventory && product.stock < item.quantity) return res.status(400).json({ error: `Insufficient stock for: ${product.name}` });

      const itemSubtotal = product.price * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        product: product._id,
        productName: product.name,
        productImage: product.thumbnail?.url || product.images?.[0]?.url || '',
        vendor: product.vendor,
        vendorName: product.vendorName,
        quantity: item.quantity,
        price: product.price,
        currency: product.currency,
        subtotal: itemSubtotal,
        isDigital: product.isDigital,
        digitalFileUrl: product.isDigital ? product.digitalFileUrl : '',
      });

      if (product.trackInventory) { product.stock -= item.quantity; }
      product.totalOrders += item.quantity;
      product.totalRevenue += itemSubtotal;
      await product.save();
    }

    const order = await Order.create({
      customer: req.user._id,
      customerName: req.user.name,
      customerEmail: req.user.email,
      items: orderItems,
      subtotal,
      totalAmount: subtotal,
      currency: currency || 'USD',
      shippingAddress,
      customerNote: customerNote || '',
    });

    await User.findByIdAndUpdate(req.user._id, { $inc: { totalOrders: 1, totalSpent: subtotal } });

    res.status(201).json({ order, message: 'Order placed successfully!' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

orderRouter.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).sort('-createdAt').limit(20);
    res.json({ orders });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = orderRouter;
