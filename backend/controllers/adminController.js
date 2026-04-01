const { prisma } = require('../config/db');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    
    const users = await prisma.user.findMany({
      where: role ? { role } : {},
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isApproved: true,
        farmName: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve/Suspend a farmer
// @route   PUT /api/admin/users/:id/approve
// @access  Private (Admin)
const toggleApproveFarmer = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { isApproved } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== 'farmer') {
      return res.status(404).json({ success: false, message: 'Farmer not found' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isApproved },
      select: {
        id: true,
        name: true,
        role: true,
        isApproved: true,
        email: true,
      },
    });

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders over the platform
// @route   GET /api/admin/orders
// @access  Private (Admin)
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: { select: { name: true, email: true } },
        items: {
          include: {
            product: { select: { name: true, farmerId: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalProducts, totalOrders] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
    ]);

    // Calculate total revenue from all orders
    const orders = await prisma.order.findMany({
      select: { totalAmount: true },
    });
    const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        revenue,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  toggleApproveFarmer,
  getAllOrders,
  getDashboardStats,
};
