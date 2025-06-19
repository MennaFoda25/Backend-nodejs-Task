const pool = require('../config/database');
const { applyQueryFeatures } = require('../utils/apiFeatures')
// Create product
exports.createProduct = async (req, res) => {
  const { name, category, price } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO products (name, category, price) VALUES ($1, $2, $3) RETURNING *',
      [name, category, price]
    );
    res.status(201).json({ data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  const baseQuery = 'SELECT * FROM products';
  const { sql, values, pagination } = applyQueryFeatures(baseQuery, req.query);

  try {
    const result = await pool.query(sql, values);
    res.status(200).json({
      results: result.rowCount,
      pagination,
      data: result.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const fields = ['name', 'category', 'price'];
  const updates = [];
  const values = [];

  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates.push(`${field} = $${updates.length + 1}`);
      values.push(req.body[field]);
    }
  });

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields provided to update' });
  }

  values.push(id);
  const updateQuery = `UPDATE products SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`;

  try {
    const result = await pool.query(updateQuery, values);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const used = await pool.query(
      'SELECT id FROM receipt_products WHERE product_id = $1',
      [id]
    );
    if (used.rowCount > 0) {
      return res.status(400).json({ error: 'Cannot delete product linked to receipts' });
    }

    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
