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
    const [totalUsers, totalProducts, totalOrders, farmers, customers] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count({ where: { role: 'farmer' } }),
      prisma.user.count({ where: { role: 'customer' } }),
    ]);

    // Calculate total revenue
    const orders = await prisma.order.findMany({
      select: { totalAmount: true, createdAt: true },
    });
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Monthly breakdown (simple last 6 months)
    const monthlyRevenue = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Grouping logic for simplicity in this MVP
    const monthGroup = {};
    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const m = months[date.getMonth()];
      monthGroup[m] = (monthGroup[m] || 0) + order.totalAmount;
    });

    // Take current month and previous 5
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = months[d.getMonth()];
      monthlyRevenue.push({ name: m, revenue: monthGroup[m] || 0 });
    }

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalFarmers: farmers,
        totalCustomers: customers,
        totalProducts,
        totalOrders,
        revenue: totalRevenue,
        monthlyRevenue,
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
