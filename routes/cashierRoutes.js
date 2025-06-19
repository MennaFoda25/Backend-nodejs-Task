const express = require('express');
const router = express.Router();
const {
  createCashier,
  getAllCashiers,
  getCashierById,
  updateCashier,
  deleteCashier
} = require('../services/cashiersServices');

router.route('/')
  .post(createCashier)
  .get(getAllCashiers);

router.route('/:id')
  .get(getCashierById)
  .put(updateCashier)
  .delete(deleteCashier);

module.exports = router;
