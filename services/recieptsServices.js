const pool = require('../config/database');

exports.createReceipt = async (req, res) => {
  const { cashier_id, products } = req.body;
  try {
    // Step 1: Calculate total
    let total = 0;

    for (let item of products) {
      const result = await pool.query('SELECT price FROM products WHERE id = $1', [item.product_id]);
      if (result.rowCount === 0) {
        return res.status(400).json({ error: `Product ${item.product_id} not found` });
      }
      const price = parseFloat(result.rows[0].price);
      total += price * item.quantity;
    }

    // Step 2: Insert into receipts
    const receiptResult = await pool.query(
      'INSERT INTO receipts (cashier_id, total_amount) VALUES ($1, $2) RETURNING *',
      [cashier_id, total]
    );
    const receipt = receiptResult.rows[0];

    // Step 3: Insert into receipt_products
    for (let item of products) {
      await pool.query(
        'INSERT INTO receipt_products (receipt_id, product_id, quantity) VALUES ($1, $2, $3)',
        [receipt.id, item.product_id, item.quantity]
      );
    }

    res.status(201).json({ message: 'Receipt created successfully', receipt_id: receipt.id, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all receipts (with product + branch info)
exports.getAllReceipts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        r.id AS receipt_id,
        r.created_at,
        r.total_amount,
        c.name AS cashier_name,
        b.name AS branch_name,
        json_agg(
          json_build_object(
            'product_name', p.name,
            'category', p.category,
            'price', p.price,
            'quantity', rp.quantity
          )
        ) AS products
      FROM receipts r
      JOIN cashiers c ON r.cashier_id = c.id
      JOIN branches b ON c.branch_id = b.id
      JOIN receipt_products rp ON r.id = rp.receipt_id
      JOIN products p ON rp.product_id = p.id
      GROUP BY r.id, c.name, b.name
      ORDER BY r.created_at DESC
    `);

    res.status(200).json({
      results: result.rowCount,
      data: result.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
