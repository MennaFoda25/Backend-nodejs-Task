const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../services/productsServices');
const {
 createProductValidator
} = require('../utils/validators/productsValidator');

const { protect, allowedTo } = require('../middlewares/authMiddleware');


router.route('/')
  .post(protect, allowedTo('admin'),createProductValidator,createProduct)
  .get(getAllProducts);

router.route('/:id')
  .get(protect, allowedTo('admin'),getProductById)
  .put(protect, allowedTo('admin'),updateProduct)
  .delete(protect, allowedTo('admin'),deleteProduct);

module.exports = router;
