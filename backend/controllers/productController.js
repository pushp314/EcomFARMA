const { prisma } = require('../config/db');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { category, search } = req.query;

    let whereClause = {};

    if (category) {
      whereClause.category = { equals: category, mode: 'insensitive' };
    }

    if (search) {
      whereClause.name = { contains: search, mode: 'insensitive' };
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        farmer: {
          select: { name: true, farmName: true, city: true, state: true, latitude: true, longitude: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        farmer: {
          select: { name: true, farmName: true, city: true, state: true, avatarUrl: true },
        },
        reviews: {
          include: { user: { select: { name: true, avatarUrl: true } } },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private (Farmer)
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, image, stock, unit } = req.body;

    // Optional: Only approved farmers can create products
    if (!req.user.isApproved) {
      return res.status(403).json({ success: false, message: 'Your account must be approved by an admin to create products.' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        image,
        stock: parseInt(stock, 10),
        unit,
        farmerId: req.user.id,
      },
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Farmer)
const updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const { name, description, price, category, image, stock, unit } = req.body;

    const existingProduct = await prisma.product.findUnique({ where: { id: productId } });

    if (!existingProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (existingProduct.farmerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this product' });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(category && { category }),
        ...(image && { image }),
        ...(stock !== undefined && { stock: parseInt(stock, 10) }),
        ...(unit && { unit }),
      },
    });

    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Farmer/Admin)
const deleteProduct = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    
    // Ensure only the farmer who created the product (or an admin) can delete it
    if (product.farmerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this product' });
    }

    await prisma.product.delete({ where: { id: req.params.id } });
    res.status(200).json({ success: true, message: 'Product removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a review to a product
// @route   POST /api/products/:id/reviews
// @access  Private (Customer)
const addProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    if (req.user.role !== 'customer') {
      return res.status(403).json({ success: false, message: 'Only customers can leave reviews' });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user already reviewed
    const existingReview = await prisma.review.findFirst({
      where: { productId, userId: req.user.id }
    });

    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    const review = await prisma.review.create({
      data: {
        rating: Number(rating),
        comment,
        productId,
        userId: req.user.id
      },
      include: {
        user: { select: { name: true, avatarUrl: true } }
      }
    });

    res.status(201).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a product
// @route   GET /api/products/:id/reviews
// @access  Public
const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: req.params.id },
      include: {
        user: { select: { name: true, avatarUrl: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Get farmer's own products
// @route   GET /api/products/farmer/me
// @access  Private (Farmer)
const getFarmerProducts = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      where: { farmerId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFarmerProducts,
  addProductReview,
  getProductReviews,
};
