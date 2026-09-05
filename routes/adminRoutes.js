const express = require('express');
const router = express.Router();
const {
  getAdminAnalytics,
  getAllUsers,
  updateUserRole,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorizeRoles('admin'));

router.get('/analytics', getAdminAnalytics);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUserRole);

module.exports = router;
