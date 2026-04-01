const { prisma } = require('../config/db');
const { sendTokenResponse } = require('../utils/helpers');
const bcrypt = require('bcryptjs');

const formatUserResponse = (user) => {
  const result = { ...user };
  delete result.password;
  
  result.avatar = { url: user.avatarUrl };
  result.address = {
    street: user.street,
    city: user.city,
    state: user.state,
    pincode: user.pincode,
    country: user.country
  };
  
  return result;
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, farmName, farmDescription, address, location } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    let street, city, state, pincode;
    if (address && typeof address === 'object') {
      ({ street, city, state, pincode } = address);
    }

    let latitude, longitude;
    if (location?.coordinates && location.coordinates.length === 2) {
      longitude = location.coordinates[0];
      latitude = location.coordinates[1];
    }

    const encodedName = encodeURIComponent(name);
    const avatarUrl = `https://ui-avatars.com/api/?background=22c55e&color=fff&name=${encodedName}`;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'customer',
        phone,
        farmName: role === 'farmer' ? farmName : null,
        farmDescription: role === 'farmer' ? farmDescription : null,
        isApproved: role !== 'farmer',
        street,
        city,
        state,
        pincode,
        latitude,
        longitude,
        avatarUrl
      }
    });

    sendTokenResponse(formatUserResponse(user), 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (user.role === 'farmer' && !user.isApproved) {
      return res.status(403).json({
        success: false,
        message: 'Your farmer account is pending approval. Please wait for admin verification.',
      });
    }

    sendTokenResponse(formatUserResponse(user), 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({
      success: true,
      user: formatUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, farmName, farmDescription, address, location, avatarUrl, street, city, state, pincode } = req.body;
    
    let updateData = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (farmName !== undefined) updateData.farmName = farmName;
    if (farmDescription !== undefined) updateData.farmDescription = farmDescription;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
    
    // Support flat address fields
    if (street !== undefined) updateData.street = street;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (pincode !== undefined) updateData.pincode = pincode;

    // Support nested address object (legacy)
    if (address && typeof address === 'object') {
        if (address.street !== undefined) updateData.street = address.street;
        if (address.city !== undefined) updateData.city = address.city;
        if (address.state !== undefined) updateData.state = address.state;
        if (address.pincode !== undefined) updateData.pincode = address.pincode;
    }
    
    if (location?.coordinates && location.coordinates.length === 2) {
        updateData.longitude = location.coordinates[0];
        updateData.latitude = location.coordinates[1];
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData
    });

    res.status(200).json({
      success: true,
      user: formatUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, logout, updateProfile };
