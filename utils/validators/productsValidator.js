const { body } = require('express-validator');

exports.createProductValidator = [
  body('name').notEmpty().withMessage('Product name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('price')
    .isFloat({ min: 0.01 })
    .withMessage('Price must be a positive number'),
];
