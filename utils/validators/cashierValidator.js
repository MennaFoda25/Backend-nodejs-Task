// 📁 middlewares/validators/cashierValidator.js
const { body, param } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');


exports.createCashierValidator = [
  body('name')
    .notEmpty()
    .withMessage('Cashier name is required')
    .isLength({ min: 3 })
    .withMessage('Cashier name must be at least 3 characters'),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  body('passwordConfirm')
    .notEmpty()
    .withMessage('Password confirmation is required')
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),

  body('branch_id')
    .notEmpty()
    .withMessage('Branch ID is required')
    .isInt()
    .withMessage('Branch ID must be an integer'),

  body('role')
    .optional()
    .isIn(['cashier'])
    .withMessage('Role must be cashier'),
    validatorMiddleware
  
];

exports.getCashierValidator = [
  param('id').isInt().withMessage('Cashier ID must be an integer'),
  validatorMiddleware
];

exports.updateCashierValidator = [
  param('id').isInt().withMessage('Cashier ID must be an integer'),

  body('name')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Cashier name must be at least 3 characters'),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Must be a valid email'),

  body('branch_id')
    .optional()
    .isInt()
    .withMessage('Branch ID must be an integer'),
    validatorMiddleware
];

exports.deleteCashierValidator = [
  param('id').isInt().withMessage('Cashier ID must be an integer'),
  validatorMiddleware
];

exports.changeCashierPasswordValidator = [
  param('id').isInt().withMessage('Cashier ID must be an integer'),

  body('currentPassword')
    .notEmpty()
    .withMessage('You must enter your current password'),

  body('password')
    .notEmpty()
    .withMessage('You must enter new password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  body('passwordConfirm')
    .notEmpty()
    .withMessage('You must enter the password confirm')
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
    validatorMiddleware
];