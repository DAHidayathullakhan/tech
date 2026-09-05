const ContactMessage = require('../models/ContactMessage');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Submit contact message
// @route   POST /api/contact
// @access  Public
exports.submitContactMessage = async (req, res) => {
  try {
    const { name, email, phone, userRole, serviceTopic, message } = req.body;

    const contact = await ContactMessage.create({
      name,
      email,
      phone,
      userRole: userRole || 'customer',
      serviceTopic: serviceTopic || 'General Support Inquiry',
      message,
    });

    // Notify admins
    const admins = await User.find({ role: 'admin' });
    const notifications = admins.map((admin) => ({
      user: admin._id,
      title: '📬 New Inquiry Received',
      message: `Contact message from ${name} (${serviceTopic})`,
      type: 'system_alert',
      link: '#contact',
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been submitted successfully.',
      contact,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private (Admin / Staff)
exports.getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: messages.length, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
