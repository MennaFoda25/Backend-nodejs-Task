const express = require('express');
const {signupValidator} = require('../utils/validators/adminValidator');
const { signup , changeAdminPassword} = require('../services/adminServices');
const AuthService = require('../services/authServices');

const router = express.Router();
router.use(AuthService.protect);

router.use(AuthService.allowedTo('admin'));

router.put('/changeMyPassword/:id',changeAdminPassword);


router.route('/').post(signupValidator,signup);


module.exports = router;