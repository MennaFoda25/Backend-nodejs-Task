const express = require('express');
const router = express.Router();
const {
  createReceipt,
  getAllReceipts
} = require('../services/recieptsServices');

const { protect, allowedTo } = require('../middlewares/authMiddleware');


router.route('/')
  .post(protect, allowedTo('cashier'),createReceipt)
  .get(getAllReceipts);

module.exports = router;
