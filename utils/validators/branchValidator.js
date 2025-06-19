const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.getBranchValidator = [
  check('id').isMongoId().withMessage('Invalid branch id format'),
  validatorMiddleware,
];

exports.createBranchValidator = [
  check('name')
    .notEmpty()
    .withMessage('branch name is required')
    .isLength({ max: 32 })
    .withMessage('Too long category name'),
  check('address').notEmpty().withMessage('branch address is required').isLength({ max: 255 }),
  check('phone')
    .optional()
    .isMobilePhone('ar-EG')
    .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'), 
     validatorMiddleware,
];

exports.updateBranchValidator = [
  check('id').isMongoId().withMessage('Invalid branch id format'),
  validatorMiddleware,
];

exports.deleteBranchValidator = [
  check('id').isMongoId().withMessage('Invalid branch id format'),
  validatorMiddleware,
];