// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error('❌ Error:', err);

  // Prisma unique constraint violation (similar to Mongoose 11000)
  if (err.code === 'P2002') {
    const target = err.meta?.target || 'field';
    error.message = `An account with this ${target} already exists.`;
    return res.status(400).json({ success: false, message: error.message });
  }

  // Prisma record not found
  if (err.code === 'P2025') {
    error.message = 'Resource not found';
    return res.status(404).json({ success: false, message: error.message });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token. Please log in again.';
    return res.status(401).json({ success: false, message: error.message });
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired. Please log in again.';
    return res.status(401).json({ success: false, message: error.message });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
