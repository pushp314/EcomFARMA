const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const isConfigured = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name';

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Setup Multer Storage for Cloudinary
const storage = isConfigured ? new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ecomfarma',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }], 
  },
}) : multer.memoryStorage(); // Fallback to memory storage if not configured

const upload = multer({ storage });

module.exports = { cloudinary, upload, isConfigured };
