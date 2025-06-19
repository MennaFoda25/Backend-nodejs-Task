const express = require('express');
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require('../utils/validators/categoryValidator'); 

const AuthService = require('../services/authServices');

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../services/categoryServices');

const { protect, allowedTo } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(AuthService.protect);
router.use(AuthService.allowedTo('admin'));
router.route('/').get(getCategories).post(createCategoryValidator,createCategory);
router
  .route('/:id')
  .get(getCategoryValidator,getCategory)
  .put(updateCategoryValidator,updateCategory)
  .delete(deleteCategoryValidator,deleteCategory);

module.exports = router;