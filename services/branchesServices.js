const { v4: uuidv4 } = require("uuid");
const factory = require('./handlerFactory');
const Branch = require('../models/branchesModel');
const Cashier = require('../models/cashiersModel');
const ApiError = require('../utils/apiError');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const sharp = require('sharp');

// @desc    Get list of branches
// @route   GET /api/v1/branches
// @access  Public
exports.getBranches = factory.getAll(Branch, 'Branches');

// @desc    Get specific branch by id
// @route   GET /api/v1/branch/:id
// @access  Public
exports.getBranch = factory.getOne(Branch);

// @desc    Create branch
// @route   POST  /api/v1/branch
// @access  Private
exports.createBranch = factory.createOne(Branch);
// @desc    Update specific branch
// @route   PUT /api/v1/branch/:id
// @access  Private
exports.updateBranch = factory.updateOne(Branch);


// @desc    Delete specific branch
// @route   DELETE /api/v1/branch/:id
// @access  Private
exports.deleteBranch = asyncHandler(async (req, res, next) => { const { id } = req.params;

  // 1. Check if the branch exists
  const branch = await Branch.findById(id);
  if (!branch) {
    return next(new ApiError('Branch not found', 404));
  }

  // 2. Check if there are any cashiers associated with this branch
  const cashierCount = await Cashier.countDocuments({ branch: id });

  if (cashierCount > 0) {
    return next(
      new ApiError('Cannot delete branch with associated cashiers', 400)
    );
  }

  // 3. Delete the branch
  await Branch.findByIdAndDelete(id);

  res.status(200).json({
    status: 'success',
    message: 'Branch deleted successfully'
  });
}) 