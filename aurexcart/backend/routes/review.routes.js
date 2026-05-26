const express = require('express');
const router = express.Router();
const Review = require('../models/Review.model');
const Product = require('../models/Product.model');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth.middleware');

router.get('/product/:productId', optionalAuth, async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId, isApproved: true }).sort('-createdAt').limit(50);
    res.json({ reviews });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const { productId, rating, title, body, images } = req.body;
    const existing = await Review.findOne({ product: productId, reviewer: req.user._id });
    if (existing) return res.status(400).json({ error: 'You already reviewed this product.' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found.' });

    const review = await Review.create({
      product: productId,
      reviewer: req.user._id,
      reviewerName: req.user.name,
      reviewerAvatar: req.user.avatar,
      rating, title, body, images: images || [],
    });

    await product.updateRating(rating);
    res.status(201).json({ review });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/:id/helpful', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found.' });
    const alreadyVoted = review.helpfulVoters.includes(req.user._id);
    if (alreadyVoted) {
      review.helpfulVoters.pull(req.user._id);
      review.helpfulVotes -= 1;
    } else {
      review.helpfulVoters.push(req.user._id);
      review.helpfulVotes += 1;
    }
    await review.save();
    res.json({ helpfulVotes: review.helpfulVotes, voted: !alreadyVoted });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ message: 'Review deleted.' });
});

module.exports = router;
