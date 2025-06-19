// 📁 routes/adminRoutes.js
const express = require('express');
const { signupValidator } = require('../middlewares/validators/authValidator');
const { signup, changeAdminPassword } = require('../controllers/authController');
const { protect, allowedTo } = require('../middlewares/authMiddleware');

const router = express.Router();

// Protected admin-only routes
router.use(protect);
router.use(allowedTo('admin'));

router.put('/change-password/:id', changeAdminPassword);
router.post('/signup', signupValidator, signup);

module.exports = router;
