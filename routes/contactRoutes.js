const express = require('express');
const router = express.Router();
const {
  submitContactMessage,
  getContactMessages,
} = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.post('/', submitContactMessage);
router.get('/', protect, authorizeRoles('admin', 'support_staff'), getContactMessages);

module.exports = router;
