const jwt = require('jsonwebtoken');

const createToken = (user,role) =>
  jwt.sign({userId: user._id, role: role }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

module.exports = createToken;