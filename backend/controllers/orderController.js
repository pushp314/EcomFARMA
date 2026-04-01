const { prisma } = require('../config/db');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (Customer)
const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, isPaid, paymentDetails } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    // Calculate total amount
    const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const order = await prisma.order.create({
      data: {
        totalAmount,
        customerId: req.user.id,
        shippingStreet: shippingAddress.street,
        shippingCity: shippingAddress.city,
        shippingState: shippingAddress.state,
        shippingPincode: shippingAddress.pincode,
        paymentStatus: isPaid ? 'Paid' : 'Unpaid',
        paymentId: paymentDetails?.razorpay_payment_id || null,
        items: {
          create: items.map((item) => ({
            quantity: item.quantity,
            price: item.price,
            productId: item.productId,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Determine the product IDs to update their stock count
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    res.status(201).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { customerId: req.user.id },
      include: {
        items: {
          include: {
            product: { select: { name: true, image: true, farmer: { select: { farmName: true } } } },
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

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        customer: { select: { name: true, email: true, phone: true } },
        items: {
          include: {
            product: { select: { name: true, image: true, farmerId: true } },
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Need to verify if user is customer of this order, or farmer of any products in the order, or admin
    if (order.customerId !== req.user.id && req.user.role !== 'admin') {
      const isFarmerAssociated = order.items.some(item => item.product.farmerId === req.user.id);
      if (!isFarmerAssociated) {
          return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
      }
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin/Farmer)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    // For simplicity, farmers or admins can update status. 
    // In a true multivendor, you'd track status per item shipped by individual farmers.
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get farmer orders
// @route   GET /api/orders/farmer
// @access  Private (Farmer)
const getFarmerOrders = async (req, res, next) => {
  try {
    // Find all orders that contain products belonging to this farmer
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              farmerId: req.user.id,
            },
          },
        },
      },
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

    // We filter items to only show the farmer their own products, but keep the order info intact
    const filteredOrders = orders.map(order => ({
        ...order,
        items: order.items.filter(item => item.product.farmerId === req.user.id)
    }));

    res.status(200).json({ success: true, orders: filteredOrders });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getFarmerOrders,
};
