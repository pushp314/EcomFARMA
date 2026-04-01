const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFarmerProducts,
  addProductReview,
  getProductReviews,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getProducts);
router.get('/farmer/me', protect, authorize('farmer'), getFarmerProducts);
router.get('/:id', getProductById);
router.post('/', protect, authorize('farmer', 'admin'), createProduct);
router.put('/:id', protect, authorize('farmer', 'admin'), updateProduct);
router.delete('/:id', protect, authorize('farmer', 'admin'), deleteProduct);

router.post('/:id/reviews', protect, authorize('customer'), addProductReview);
router.get('/:id/reviews', getProductReviews);

module.exports = router;
