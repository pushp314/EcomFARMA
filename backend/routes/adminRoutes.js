const express = require('express');
const router = express.Router();
const {
  getUsers,
  toggleApproveFarmer,
  getAllOrders,
  getDashboardStats,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Apply protection to all routes below
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id/approve', toggleApproveFarmer);
router.get('/orders', getAllOrders);

module.exports = router;
