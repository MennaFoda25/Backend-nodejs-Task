const slugify = require('slugify');
const bcrypt = require('bcryptjs');
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const Cashier = require('../../models/cashiersModel');
const Branch = require('../../models/branchesModel');

exports.createCashierValidator = [
  check('name')
    .notEmpty()
    .withMessage('cashier name is required')
    .isLength({ min: 3 })
    .withMessage('Too short cashier name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom((val) =>
      Cashier.findOne({ email: val }).then((cashier) => {
        if (cashier) {
          return Promise.reject(new Error('E-mail already in use'));
        }
      })
    ),

  check('branch').notEmpty()
  .withMessage('Branch is required')
  .isMongoId()
    .withMessage('Invalid ID formate')
    .custom((branchId) =>
      Branch.findById(branchId).then((branch) => {
        if (!branch) {
          return Promise.reject(
            new Error(`No branch for this id: ${branchId}`)
          );
        }
      })
    ),
  check('password')
    .notEmpty()
    .withMessage('Password required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error('Password Confirmation incorrect');
      }
      return true;
    }),

  check('passwordConfirm')
    .notEmpty()
    .withMessage('Password confirmation required'),


  check('image').optional(),
  check('role').optional(),

  validatorMiddleware,
];

exports.changeCashierPasswordValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  body('currentPassword')
    .notEmpty()
    .withMessage('You must enter your current password'),
  body('passwordConfirm')
    .notEmpty()
    .withMessage('You must enter the password confirm'),
  body('password')
    .notEmpty()
    .withMessage('You must enter new password')
    .custom(async (val, { req }) => {
      // 1) Verify current password
      const cashier = await Cashier.findById(req.params.id);
      if (!cashier) {
        throw new Error('There is no user for this id');
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        cashier.password
      );
      if (!isCorrectPassword) {
        throw new Error('Incorrect current password');
      }

      // 2) Verify password confirm
      if (val !== req.body.passwordConfirm) {
        throw new Error('Password Confirmation incorrect');
      }
      return true;
    }),
  validatorMiddleware,
];

exports.getCashierValidator = [
  check('id').isMongoId().withMessage('Invalid id format'),
  validatorMiddleware,
];

exports.updateCashierValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  body('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom((val) =>
      Cashier.findOne({ email: val }).then((cashier) => {
        if (cashier) {
          return Promise.reject(new Error('E-mail already in use'));
        }
      })
    ),
  
  check('image').optional(),
  check('role').optional(),
  validatorMiddleware,
];

// exports.changeUserPasswordValidator = [
//   check('id').isMongoId().withMessage('Invalid User id format'),
//   body('currentPassword')
//     .notEmpty()
//     .withMessage('You must enter your current password'),
//   body('passwordConfirm')
//     .notEmpty()
//     .withMessage('You must enter the password confirm'),
//   body('password')
//     .notEmpty()
//     .withMessage('You must enter new password')
//     .custom(async (val, { req }) => {
//       // 1) Verify current password
//       const user = await User.findById(req.params.id);
//       if (!user) {
//         throw new Error('There is no user for this id');
//       }
//       const isCorrectPassword = await bcrypt.compare(
//         req.body.currentPassword,
//         user.password
//       );
//       if (!isCorrectPassword) {
//         throw new Error('Incorrect current password');
//       }

//       // 2) Verify password confirm
//       if (val !== req.body.passwordConfirm) {
//         throw new Error('Password Confirmation incorrect');
//       }
//       return true;
//     }),
//   validatorMiddleware,
// ];

exports.deleteCashierValidator = [
  check('id').isMongoId().withMessage('Invalid  id format'),
  validatorMiddleware,
];

// exports.updateLoggedUserValidator = [
//   body('name')
//     .optional()
//     .custom((val, { req }) => {
//       req.body.slug = slugify(val);
//       return true;
//     }),
//   check('email')
//     .notEmpty()
//     .withMessage('Email required')
//     .isEmail()
//     .withMessage('Invalid email address')
//     .custom((val) =>
//       User.findOne({ email: val }).then((user) => {
//         if (user) {
//           return Promise.reject(new Error('E-mail already in user'));
//         }
//       })
//     ),
//   check('phone')
//     .optional()
//     .isMobilePhone(['ar-EG', 'ar-SA'])
//     .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),

//   validatorMiddleware,
// ];