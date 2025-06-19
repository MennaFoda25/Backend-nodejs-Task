const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

// Utility: Generate JWT
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || 'your_jwt_secret',
    { expiresIn: '7d' }
  );
};

// Signup (Cashier or Admin)
exports.signup = async (req, res) => {
  const { name, email, password, branch_id, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Only insert into correct table
    let insertQuery = '';
    if (role === 'admin') {
      insertQuery = `
        INSERT INTO admins (name, email, password)
        VALUES ($1, $2, $3) RETURNING id
      `;
    } else if (role === 'cashier') {
      insertQuery = `
        INSERT INTO cashiers (name, email, password, branch_id)
        VALUES ($1, $2, $3, $4) RETURNING id
      `;
    } else {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const result = await pool.query(insertQuery, [name, email, hashedPassword, branch_id]);
    const userId = result.rows[0].id;

    const token = generateToken(userId, role);
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let userQuery = '';
    if (role === 'admin') {
      userQuery = 'SELECT * FROM admins WHERE email = $1';
    } else if (role === 'cashier') {
      userQuery = 'SELECT * FROM cashiers WHERE email = $1';
    } else {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const result = await pool.query(userQuery, [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id, role);
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
