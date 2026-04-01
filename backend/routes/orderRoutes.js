const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getFarmerOrders,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('customer'), createOrder);
router.get('/my', protect, authorize('customer'), getMyOrders);
router.get('/farmer', protect, authorize('farmer'), getFarmerOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, authorize('farmer', 'admin'), updateOrderStatus);

module.exports = router;
