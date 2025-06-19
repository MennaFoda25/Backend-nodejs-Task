// 📁 middlewares/validators/branchValidator.js
const { body, param } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');


exports.createBranchValidator = [
  body('name')
    .notEmpty()
    .withMessage('Branch name is required')
    .isLength({ max: 32 })
    .withMessage('Too long branch name'),

  body('address')
    .notEmpty()
    .withMessage('Branch address is required')
    .isLength({ max: 255 })
    .withMessage('Too long branch address'),

  body('phone')
    .optional()
    .matches(/^01[0-2,5]{1}[0-9]{8}$/)
    .withMessage('Invalid Egyptian phone number'),
    validatorMiddleware
];

exports.getBranchValidator = [
  param('id').isInt().withMessage('Branch ID must be an integer'),
  validatorMiddleware
];

exports.updateBranchValidator = [
  param('id').isInt().withMessage('Branch ID must be an integer'),

  body('name')
    .optional()
    .isLength({ max: 32 })
    .withMessage('Too long branch name'),

  body('address')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Too long branch address'),

  body('phone')
    .optional()
    .matches(/^01[0-2,5]{1}[0-9]{8}$/)
    .withMessage('Invalid Egyptian phone number'),validatorMiddleware
];

exports.deleteBranchValidator = [
  param('id').isInt().withMessage('Branch ID must be an integer'),validatorMiddleware
];
