const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/auth.middleware');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg','image/png','image/webp','image/gif','model/gltf-binary','model/gltf+json','application/octet-stream'];
    if (allowed.includes(file.mimetype) || file.originalname.match(/\.(glb|gltf)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'), false);
    }
  },
});

// Base64 upload endpoint (works without Cloudinary for initial setup)
router.post('/base64', protect, async (req, res) => {
  try {
    const { data, filename, type } = req.body;
    if (!data) return res.status(400).json({ error: 'No file data provided.' });

    // If Cloudinary is configured, upload there
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      // Dynamic require to avoid breaking if not installed
      try {
        const cloudinary = require('cloudinary').v2;
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        const result = await cloudinary.uploader.upload(data, {
          folder: 'aurexcart',
          resource_type: 'auto',
        });
        return res.json({ url: result.secure_url, publicId: result.public_id });
      } catch (cloudErr) {
        console.warn('Cloudinary upload failed, using base64:', cloudErr.message);
      }
    }

    // Fallback: return the base64 data URL directly (for demo/free tier)
    res.json({ url: data, publicId: `local_${Date.now()}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/image', protect, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image uploaded.' });
  const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  res.json({ url: base64, publicId: `upload_${Date.now()}` });
});

module.exports = router;
