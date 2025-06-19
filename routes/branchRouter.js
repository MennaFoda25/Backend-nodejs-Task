const express = require('express');
const router = express.Router();
const {
  createBranch,
  getAllBranches,
  getBranchById,
  updateBranch,
  deleteBranch
} = require('../services/branchesServices');

const { protect, allowedTo } = require('../middlewares/authMiddleware');

router.route('/')
  .post( protect, allowedTo('admin'),createBranch)
  .get( protect, allowedTo('admin'),getAllBranches);

router.route('/:id')
  .get( protect, allowedTo('admin'),getBranchById)
  .put( protect, allowedTo('admin'),updateBranch)
  .delete(protect, allowedTo('admin'),deleteBranch);

module.exports = router;



// const express = require('express');

// // const { getBranchValidator,
// // createBranchValidator,
// // updateBranchValidator,
// // deleteBranchValidator} = require('../utils/validators/branchValidator');
// const {
//   getBranches,
// getBranch,
// createBranch,
// updateBranch,
// deleteBranch,
// } = require('../services/branchesServices');

// //const AuthService = require('../services/authServices');


// const productRoute = require('./productsRoutes');

// const router = express.Router();
// //router.use(AuthService.protect);

// //router.use(AuthService.allowedTo('admin'));

// //router.use('/:branchId/products', productRoute);

// router.route('/').get(getBranches).post(createBranchValidator,createBranch);
// router
//   .route('/:id')
//   .get( getBranchValidator,getBranch)
//   .put(updateBranchValidator, updateBranch)
//   .delete(deleteBranchValidator,deleteBranch);

// module.exports = router;