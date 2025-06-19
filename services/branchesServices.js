const pool = require('../config/database');

// Create a new branch
exports.createBranch = async (req, res) => {
  const { name, address, phone } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO branches (name, address, phone) VALUES ($1, $2, $3) RETURNING *',
      [name, address, phone]
    );
    res.status(201).json({ data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all branches
exports.getAllBranches = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM branches ORDER BY id');
    res.status(200).json({ results: result.rowCount, data: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get branch by ID
exports.getBranchById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM branches WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    res.status(200).json({ data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update branch
exports.updateBranch = async (req, res) => {
  const { id } = req.params;
  const { name, address, phone } = req.body;

  try {
    const result = await pool.query(
      'UPDATE branches SET name = $1, address = $2, phone = $3 WHERE id = $4 RETURNING *',
      [name, address, phone, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    res.status(200).json({ data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete branch
exports.deleteBranch = async (req, res) => {
  const { id } = req.params;

  try {
    // Optional: check if cashiers exist before deleting
    const cashiers = await pool.query('SELECT id FROM cashiers WHERE branch_id = $1', [id]);
    if (cashiers.rowCount > 0) {
      return res.status(400).json({ error: 'Cannot delete branch with existing cashiers' });
    }

    const result = await pool.query('DELETE FROM branches WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
