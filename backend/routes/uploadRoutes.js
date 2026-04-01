const express = require('express');
const router = express.Router();
const { upload, isConfigured } = require('../config/cloudinary');
const { protect } = require('../middleware/auth');

// @route   POST /api/upload
// @desc    Upload an image to Cloudinary
// @access  Private
router.post('/', protect, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    // Return the secure URL from Cloudinary or a mockup if not configured
    const url = isConfigured 
      ? req.file.path // Cloudinary automatically gives the path (url)
      : 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800'; // Mock 

    res.status(200).json({
      success: true,
      url,
      mocked: !isConfigured
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Image upload failed' });
  }
});

module.exports = router;
