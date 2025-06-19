const express = require('express');
const app = express();
const branchRoutes = require('./routes/branchRouter');
const cashierRoutes = require('./routes/cashierRoutes');

// Middleware
app.use(express.json());

// Routes
app.use('/api/branches', branchRoutes);
app.use('/api/cashiers', cashierRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
