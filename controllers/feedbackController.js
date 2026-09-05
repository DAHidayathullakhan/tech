const Feedback = require('../models/Feedback');

// @desc    Get public reviews & feedback
// @route   GET /api/feedback
// @access  Public
exports.getPublicFeedback = async (req, res) => {
  try {
    const reviews = await Feedback.find({ isPublic: true }).sort({ createdAt: -1 }).limit(10);
    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit new feedback / review
// @route   POST /api/feedback
// @access  Private / Public
exports.submitFeedback = async (req, res) => {
  try {
    const { rating, comment, userName, ticketId } = req.body;

    const feedback = await Feedback.create({
      user: req.user ? req.user.id : null,
      userName: userName || (req.user ? req.user.name : 'Verified Customer'),
      rating,
      comment,
      ticket: ticketId || null,
    });

    res.status(201).json({ success: true, feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
