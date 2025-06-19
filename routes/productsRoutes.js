const express = require('express');
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require('../utils/validators/productsValidator');

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  resizeImage
} = require('../services/productsServices');
const AuthService = require('../services/authServices');


const router = express.Router({ mergeParams: true });

router.use(AuthService.protect);

router.route('/').get(getProducts)

router.use(AuthService.allowedTo('admin'));

router.route('/')
.post(uploadProductImage,
  resizeImage,
  createProductValidator,
  createProduct);
router
  .route('/:id')
  .get(getProductValidator, getProduct)
  .put(uploadProductImage,
  resizeImage,updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct);

module.exports = router;