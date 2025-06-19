const { v4: uuidv4 } = require("uuid");
const factory = require('./handlerFactory');
const Cashier = require('../models/cashiersModel');
const ApiError = require('../utils/apiError');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const sharp = require('sharp');
const createToken = require('../utils/createToken');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');


// Upload single image
exports.uploadCashierImage = uploadSingleImage('image');

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `cashier-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 95 })
    .toFile(`uploads/cashiers/${filename}`);

  // Save image into our db
  req.body.image = filename;

  next();
});


// @desc    Get list of cashiers
// @route   GET /api/v1/cashiers
// @access  Public
exports.getCashiers = factory.getAll(Cashier, 'Cashiers');

// @desc    Get specific Cashier by id
// @route   GET /api/v1/Cashier/:id
// @access  Public
exports.getCashier = factory.getOne(Cashier);

// @desc    Signup
// @route   GET /api/v1/admin/signup
// @access  Public
exports.createCashier = asyncHandler(async (req, res, next) => {
  // 1- Create user
  const cashier = await Cashier.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    branch: req.body.branch,
    image: req.body.image
  });

  // 2- Generate token
  const token = createToken(cashier._id);

  res.status(201).json({ data: cashier, token });
});

// @desc    Update specific Cashier
// @route   PUT /api/v1/Cashier/:id
// @access  Private
exports.updateCashier = asyncHandler(async (req, res, next) => {
  const document = await Cashier.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      image: req.body.image,
      role: req.body.role,
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

exports.changeCashierPassword = asyncHandler(async (req, res, next) => {
  const document = await Cashier.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
     // passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});


// @desc    Delete specific Cashier
// @route   DELETE /api/v1/Cashier/:id
// @access  Private
exports.deleteCashier = factory.deleteOne(Cashier);