const express = require('express');
const router = express.Router();
const {
  createBranch,
  getAllBranches,
  getBranchById,
  updateBranch,
  deleteBranch
} = require('../services/branchesServices');

router.route('/')
  .post(createBranch)
  .get(getAllBranches);

router.route('/:id')
  .get(getBranchById)
  .put(updateBranch)
  .delete(deleteBranch);

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