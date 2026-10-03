const express = require('express');
const router = express.Router();
const {
  getUsers,
  approveFarmer,
  deleteProductAdmin,
  getPlatformStats,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/users', getUsers);
router.put('/users/:id/approve', approveFarmer);
router.delete('/products/:id', deleteProductAdmin);
router.get('/stats', getPlatformStats);

module.exports = router;
