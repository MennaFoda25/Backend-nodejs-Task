const express = require('express');
const router = express.Router();
const { getBranchValidator,
createBranchValidator,
updateBranchValidator,
deleteBranchValidator} = require('../utils/validators/branchValidator');
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
  .get( protect, allowedTo('admin'),getBranchValidator,getBranchById)
  .put( protect, allowedTo('admin'),updateBranchValidator,updateBranch)
  .delete(protect, allowedTo('admin'),deleteBranchValidator,deleteBranch);

module.exports = router;


