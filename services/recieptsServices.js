const Receipt = require('../models/recieptsModel');
const Cashier = require('../models/cashiersModel');
const Product = require('../models/productsModel');
const asyncHandler = require('express-async-handler');
const ApiFeatures = require('../utils/apiFeatures');
const ApiError = require('../utils/apiError');

// Create Receipt
exports.createReceipt = asyncHandler(async (req, res, next) => {
  const { products } = req.body;

  let total = 0;

  for (const item of products) {
    const product = await Product.findById(item.product);
    if (!product) {
      return next(new ApiError(`Product not found: ${item.product}`, 404));
    }
    total += product.price * item.quantity;
  }

  const receipt = await Receipt.create({
    cashier: req.user._id,
    products,
    totalAmount: total
  });

  res.status(201).json({ status: 'success', data: receipt });
});

// Get All Receipts (with filters and pagination)
exports.getAllReceipts = asyncHandler(async (req, res) => {
  let filter = {};

  // Filter by cashier
  if (req.query.cashier) filter.cashier = req.query.cashier;

  // Filter by branch
  if (req.query.branch) {
    // find all cashiers in this branch
    const cashiers = await Cashier.find({ branch: req.query.branch }).select('_id');
    filter.cashier = { $in: cashiers.map(c => c._id) };
  }

  // Filter by date
  if (req.query.startDate || req.query.endDate) {
    filter.createdAt = {};
    if (req.query.startDate) {
      filter.createdAt.$gte = new Date(req.query.startDate);
    }
    if (req.query.endDate) {
      filter.createdAt.$lte = new Date(req.query.endDate);
    }
  }

  // Filter by total amount
  if (req.query.minTotal || req.query.maxTotal) {
    filter.totalAmount = {};
    if (req.query.minTotal) filter.totalAmount.$gte = Number(req.query.minTotal);
    if (req.query.maxTotal) filter.totalAmount.$lte = Number(req.query.maxTotal);
  }

  const totalReceipts = await Receipt.countDocuments(filter);

  const features = new ApiFeatures(Receipt.find(filter)
    .populate('cashier', 'name email')
    .populate('products.product', 'name price category'), req.query)
    .sort()
    .limitFields()
    .paginate(totalReceipts);

  const { mongooseQuery, paginationResult } = features;
  const receipts = await mongooseQuery;

  // Filter by product name, category or price (after population)
  if (req.query.productName || req.query.productCategory || req.query.productPrice) {
    const name = req.query.productName?.toLowerCase();
    const category = req.query.productCategory?.toLowerCase();
    const price = Number(req.query.productPrice);

    const filteredReceipts = receipts.filter((receipt) =>
      receipt.products.some(({ product }) => {
        return (
          (!name || product.name?.toLowerCase().includes(name)) &&
          (!category || product.category?.toLowerCase().includes(category)) &&
          (!req.query.productPrice || product.price === price)
        );
      })
    );

    return res.status(200).json({
      results: filteredReceipts.length,
      paginationResult,
      data: filteredReceipts
    });
  }

  res.status(200).json({
    results: receipts.length,
    paginationResult,
    data: receipts
  });
});


exports.getTopCashiers = asyncHandler(async (req, res) => {
  const topCashiers = await Receipt.aggregate([
    {
      $group: {
        _id: '$cashier',
        receiptCount: { $sum: 1 }
      }
    },
    {
      $sort: { receiptCount: -1 }
    },
    {
      $limit: 3
    },
    {
      $lookup: {
        from: 'cashiers',
        localField: '_id',
        foreignField: '_id',
        as: 'cashier'
      }
    },
    {
      $unwind: '$cashier'
    },
    {
      $project: {
        _id: 0,
        cashierId: '$cashier._id',
        name: '$cashier.name',
        email: '$cashier.email',
        receiptCount: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    results: topCashiers.length,
    data: topCashiers
  });
});