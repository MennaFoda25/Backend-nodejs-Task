const express = require('express');

const { createCashierValidator,
getCashierValidator,
updateCashierValidator,
deleteCashierValidator,
changeCashierPasswordValidator} = require('../utils/validators/cashierValidator');
const {
  getCashiers,
getCashier,
createCashier,
updateCashier,
deleteCashier,
  uploadCashierImage,
  resizeImage,
  changeCashierPassword
} = require('../services/cashiersServices');


const AuthService = require('../services/authServices');

const router = express.Router();

router.use(AuthService.protect);

router.put('/changeMyPassword/:id',changeCashierPasswordValidator, changeCashierPassword);

router.use(AuthService.allowedTo('admin'));


router.route('/').get(getCashiers)
.post(
  uploadCashierImage,
  resizeImage,
  createCashierValidator,
  createCashier);

router
  .route('/:id')
  .get( getCashierValidator,getCashier)
  .put(uploadCashierImage,
  resizeImage,updateCashierValidator, updateCashier)
  .delete(deleteCashierValidator,deleteCashier);

module.exports = router;