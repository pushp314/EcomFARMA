const express = require('express');
const router = express.Router();
const {
  getUsers,
  toggleApproveFarmer,
  getAllOrders,
  getDashboardStats,
  deleteUser,
  updateOrder,
  getAdminProducts,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Apply protection to all routes below
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/approve', toggleApproveFarmer);
router.get('/orders', getAllOrders);
router.put('/orders/:id', updateOrder);
router.get('/products', getAdminProducts);

module.exports = router;
