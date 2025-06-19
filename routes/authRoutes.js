const express = require('express');
const {loginValidator} = require('../utils/validators/authValidator');
const { login} = require('../services/authServices');

const router = express.Router();

router.route('/login').post(loginValidator,login);

module.exports = router;