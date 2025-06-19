const jwt = require('jsonwebtoken');

// Protect route
exports.protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer')) {
    return res.status(401).json({ error: 'Unauthorized: No token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = decoded; // { userId, role }
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Allow only roles
exports.allowedTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};
