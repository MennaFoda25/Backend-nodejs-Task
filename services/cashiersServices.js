const pool = require('../config/database');

exports.createCashier = async (req, res) => {
  const { name, email, password, branch_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO cashiers (name, email, password, branch_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, password, branch_id]
    );
    res.status(201).json({ data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllCashiers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, b.name AS branch_name 
       FROM cashiers c 
       JOIN branches b ON c.branch_id = b.id
       ORDER BY c.id`
    );
    res.status(200).json({ results: result.rowCount, data: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCashierById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT c.*, b.name AS branch_name 
       FROM cashiers c 
       JOIN branches b ON c.branch_id = b.id
       WHERE c.id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Cashier not found' });
    }

    res.status(200).json({ data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCashier = async (req, res) => {
  const { id } = req.params;
  const fields = ['name', 'email', 'password', 'branch_id'];
  const updates = [];
  const values = [];

  fields.forEach((field, index) => {
    if (req.body[field] !== undefined) {
      updates.push(`${field} = $${updates.length + 1}`);
      values.push(req.body[field]);
    }
  });

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields provided to update' });
  }

  values.push(id); // last value is the ID
  const updateQuery = `UPDATE cashiers SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`;

  try {
    const result = await pool.query(updateQuery, values);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Cashier not found' });
    }
    res.status(200).json({ data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.deleteCashier = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if receipts exist
    const receipts = await pool.query(
      'SELECT id FROM receipts WHERE cashier_id = $1',
      [id]
    );
    if (receipts.rowCount > 0) {
      return res.status(400).json({ error: 'Cannot delete cashier with existing receipts' });
    }

    const result = await pool.query(
      'DELETE FROM cashiers WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Cashier not found' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
