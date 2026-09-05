const express = require('express');
const router = express.Router();
const {
  getPublicFeedback,
  submitFeedback,
} = require('../controllers/feedbackController');

router.get('/', getPublicFeedback);
router.post('/', submitFeedback);

module.exports = router;
