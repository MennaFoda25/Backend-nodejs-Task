const express = require('express');
const router = express.Router();
const {
  createCashier,
  getAllCashiers,
  getCashierById,
  updateCashier,
  deleteCashier
} = require('../services/cashiersServices');

const { protect, allowedTo } = require('../middlewares/authMiddleware');

router.route('/')
  .post( protect, allowedTo('admin'),createCashier)
  .get(protect, allowedTo('admin'),getAllCashiers);

router.route('/:id')
  .get(protect, allowedTo('admin'),getCashierById)
  .put(protect, allowedTo('admin'),updateCashier)
  .delete(protect, allowedTo('admin'),deleteCashier);

module.exports = router;
