const express = require('express');
const router = express.Router();
const {
  createReceipt,
  getAllReceipts,
  getTopCashiers
} = require('../services/recieptsServices');

const AuthService = require('../services/authServices');
router.use(AuthService.protect);


router
  .route('/')
  .get(getAllReceipts)
  .post(AuthService.allowedTo('cashier'),createReceipt);

  router.get(
  '/top-cashiers',
  AuthService.allowedTo('admin'),
  getTopCashiers
);

module.exports = router;
