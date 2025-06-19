const crypto = require('crypto');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const createToken = require('../utils/createToken');

const Admin = require('../models/adminModel');
const Cashier = require('../models/cashiersModel');

// @desc    Login
// @route   GET /api/v1/auth/login
// @access  Public
exports.login = asyncHandler (async (req, res) => {
  const { email, password } = req.body;

    // check if Admin first
    let user = await Admin.findOne({ email });
    let role = 'admin';

    if (!user) {
      // else check Cashier
      user = await Cashier.findOne({ email });
      role = 'cashier';
    }

    if (!user)
      return res.status(400).json({ message: 'Invalid email or password' });

  const isMatch = await bcrypt.compare(req.body.password, user.password)
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid email or password' });

    // Create JWT
   const token = createToken(user,role);

   // Delete password from response
  delete user._doc.password;

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role
      }
    });
});



// // @desc   make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) Check if token exist, if exist get
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new ApiError(
        'You are not login, Please login to get access this route',
        401
      )
    );
  }

  // 2) Verify token (no change happens, expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

let currentUser;
   if (decoded.role === 'admin') {
    currentUser = await Admin.findById(decoded.userId);
  } else if (decoded.role === 'cashier') {
    currentUser = await Cashier.findById(decoded.userId);
  }
  // 3) Check if user exists
//   const currentUser = await Admin.findById(decoded.userId);
   if (!currentUser) {
    return next(
      new ApiError(
        'The user that belong to this token does no longer exist',
        401
      )
    );
  }

  // 4) Check if user change his password after token created
  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    // Password changed after token created (Error)
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          'User recently changed his password. please login again..',
          401
        )
      );
    }
  }

  req.user = currentUser;
 req.user.role = decoded.role; 
  next();
});



// // @desc    Authorization (User Permissions)
// // ["admin", "cashier"]
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1) access roles
    // 2) access registered user (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError('You are not allowed to access this route', 403)
      );
    }
    next();
  });
