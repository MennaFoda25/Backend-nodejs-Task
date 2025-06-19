const express = require('express');
const router = express.Router();
const { createCashierValidator,
getCashierValidator,
updateCashierValidator,
deleteCashierValidator
} = require('../utils/validators/cashierValidator');
const {
  createCashier,
  getAllCashiers,
  getCashierById,
  updateCashier,
  deleteCashier
} = require('../services/cashiersServices');

const { protect, allowedTo } = require('../middlewares/authMiddleware');

router.route('/')
  .post( protect, allowedTo('admin'),createCashierValidator,createCashier)
  .get(protect, allowedTo('admin'),getAllCashiers);

router.route('/:id')
  .get(protect, allowedTo('admin'),getCashierValidator,getCashierById)
  .put(protect, allowedTo('admin'),updateCashierValidator,updateCashier)
  .delete(protect, allowedTo('admin'),deleteCashierValidator,deleteCashier);

module.exports = router;
