const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const Product = require('../models/Product.model');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, async (req, res) => {
  const user = await User.findById(req.user._id).populate({ path: 'cart.product', select: 'name price thumbnail images stock isDigital currency vendor' });
  res.json({ cart: user.cart });
});

router.post('/add', protect, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product || product.status !== 'active') return res.status(404).json({ error: 'Product not available.' });
    if (product.trackInventory && product.stock < quantity) return res.status(400).json({ error: 'Not enough stock.' });

    const user = await User.findById(req.user._id);
    const existingIdx = user.cart.findIndex(c => c.product.toString() === productId);
    if (existingIdx > -1) {
      user.cart[existingIdx].quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }
    await user.save();
    res.json({ message: 'Added to cart', cartCount: user.cart.length });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/update', protect, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.user._id);
    const idx = user.cart.findIndex(c => c.product.toString() === productId);
    if (idx === -1) return res.status(404).json({ error: 'Item not in cart.' });
    if (quantity <= 0) { user.cart.splice(idx, 1); }
    else { user.cart[idx].quantity = quantity; }
    await user.save();
    res.json({ message: 'Cart updated' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/remove/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter(c => c.product.toString() !== req.params.productId);
    await user.save();
    res.json({ message: 'Item removed' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/clear', protect, async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { cart: [] });
  res.json({ message: 'Cart cleared' });
});

module.exports = router;
