const express = require('express');
const app = express();
const branchRoutes = require('./routes/branchRouter');
const cashierRoutes = require('./routes/cashierRoutes');
const receiptRoutes = require('./routes/recieptsRoutes');
const productRoutes = require('./routes/productsRoutes');
const authRoutes = require('./routes/authRoutes');


// Middleware
app.use(express.json());

// Routes
app.use('/api/branches', branchRoutes);
app.use('/api/cashiers', cashierRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
