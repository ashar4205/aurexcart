/**
 * AurexCart — Database Seed Script
 * Seeds minimal initial data. All monetary values initialized to ZERO.
 * Run: node scripts/seed.js
 */

require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User.model');
const Vendor = require('../models/Vendor.model');
const Product = require('../models/Product.model');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB...');

  // ─── Clear all collections ───────────────────────────────────────────────
  await Promise.all([
    User.deleteMany({}),
    Vendor.deleteMany({}),
    Product.deleteMany({}),
  ]);
  console.log('Collections cleared.');

  // ─── Create Admin User ────────────────────────────────────────────────────
  const admin = await User.create({
    name: 'Ashar — Aurex Labs',
    email: 'ashar@aurexlabs.com',
    password: process.env.ADMIN_PASSWORD || 'ashar.aurex.00.4205',
    role: 'admin',
    authProvider: 'local',
    isEmailVerified: true,
    totalOrders: 0,        // ← Zero
    totalSpent: 0,         // ← Zero
  });
  console.log('Admin created:', admin.email);

  // ─── Create Aurex Labs Vendor ─────────────────────────────────────────────
  const aurexVendor = await Vendor.create({
    owner: admin._id,
    storeName: 'Aurex Labs',
    storeTagline: 'Premium Digital Products & Creative Assets',
    storeDescription: 'Official store by Aurex Labs. Find premium digital tools, creative assets, and exclusive collections.',
    cnic: '00000-0000000-0',
    payoutMethod: 'payoneer',
    payoutAccountNumber: '0000000000',
    status: 'active',
    isVerified: true,
    analytics: {
      totalProducts: 0,      // ← Zero
      totalOrders: 0,        // ← Zero
      totalRevenue: 0,       // ← Zero
      totalViews: 0,         // ← Zero
      pendingPayouts: 0,     // ← Zero
      completedPayouts: 0,   // ← Zero
      averageRating: 0,      // ← Zero
      reviewCount: 0,        // ← Zero
    },
  });
  console.log('Aurex Labs vendor created.');

  // Update admin with vendor store
  admin.role = 'admin';
  admin.vendorStore = aurexVendor._id;
  await admin.save();

  // ─── Seed Sample Products (prices at 0 for clean slate) ──────────────────
  const sampleProducts = [
    {
      name: 'AurexCart Pro Theme Bundle',
      description: 'Premium collection of React UI components, Tailwind CSS themes, and Framer Motion animation presets. Build stunning interfaces instantly.',
      shortDescription: 'Premium React & Tailwind UI Kit',
      price: 0,              // ← Zero — set your own price
      comparePrice: 0,       // ← Zero
      currency: 'USD',
      category: 'aurex-labs',
      tags: ['react', 'tailwind', 'ui-kit', 'templates'],
      stock: 999,
      isDigital: true,
      isAurexLabsProduct: true,
      isFeatured: true,
      vendor: aurexVendor._id,
      vendorName: 'Aurex Labs',
      status: 'active',
      images: [{ url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800', alt: 'AurexCart Pro Theme' }],
      thumbnail: { url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400' },
      metaTitle: 'AurexCart Pro Theme Bundle — Premium React UI Kit',
      metaDescription: 'Premium React & Tailwind CSS UI components bundle by Aurex Labs.',
      views: 0,              // ← Zero
      totalOrders: 0,        // ← Zero
      totalRevenue: 0,       // ← Zero
      shareCount: 0,         // ← Zero
    },
    {
      name: 'Digital Art Collection Vol.1',
      description: 'Exclusive collection of original digital artworks and illustrations. High-resolution files ready for print and digital use.',
      shortDescription: 'Original digital artwork collection',
      price: 0,
      currency: 'USD',
      category: 'arts',
      tags: ['art', 'illustration', 'digital', 'creative'],
      stock: 100,
      isDigital: true,
      vendor: aurexVendor._id,
      vendorName: 'Aurex Labs',
      status: 'active',
      images: [{ url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800', alt: 'Digital Art' }],
      thumbnail: { url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400' },
      views: 0, totalOrders: 0, totalRevenue: 0, shareCount: 0,
    },
    {
      name: 'Social Media Template Pack',
      description: 'Professional social media templates for Instagram, TikTok, and LinkedIn. Fully editable Canva & Figma files included.',
      shortDescription: '50+ editable social media templates',
      price: 0,
      currency: 'USD',
      category: 'digital-products',
      tags: ['social-media', 'templates', 'instagram', 'canva'],
      stock: 500,
      isDigital: true,
      isAurexLabsProduct: true,
      vendor: aurexVendor._id,
      vendorName: 'Aurex Labs',
      status: 'active',
      images: [{ url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800', alt: 'Social Templates' }],
      thumbnail: { url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400' },
      views: 0, totalOrders: 0, totalRevenue: 0, shareCount: 0,
    },
  ];

  for (const p of sampleProducts) {
    await Product.create(p);
  }
  aurexVendor.analytics.totalProducts = sampleProducts.length;
  await aurexVendor.save();

  console.log(`Seeded ${sampleProducts.length} sample products.`);
  console.log('\n✅ Seed complete! All monetary values initialized to ZERO.\n');
  console.log('Admin Login:');
  console.log('  Username: ashar.aurex');
  console.log('  Password: ashar.aurex.00.4205');

  process.exit(0);
};

seed().catch(err => { console.error('Seed error:', err); process.exit(1); });
