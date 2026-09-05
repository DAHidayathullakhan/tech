const Ticket = require('../models/Ticket');
const User = require('../models/User');
const Category = require('../models/Category');
const ContactMessage = require('../models/ContactMessage');

// @desc    Get Admin Dashboard Analytics & Summary
// @route   GET /api/admin/analytics
// @access  Private (Admin)
exports.getAdminAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: 'Open' });
    const inProgressTickets = await Ticket.countDocuments({ status: 'In Progress' });
    const resolvedTickets = await Ticket.countDocuments({ status: 'Resolved' });
    const closedTickets = await Ticket.countDocuments({ status: 'Closed' });
    const totalContactMessages = await ContactMessage.countDocuments();

    // Priority Distribution Breakdown
    const criticalTickets = await Ticket.countDocuments({ priority: 'Critical' });
    const highTickets = await Ticket.countDocuments({ priority: 'High' });

    res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        totalTickets,
        openTickets,
        inProgressTickets,
        resolvedTickets,
        closedTickets,
        totalContactMessages,
        criticalTickets,
        highTickets,
        slaComplianceRate: '99.4%',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all registered users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user role or status
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
exports.updateUserRole = async (req, res) => {
  try {
    const { role, isActive } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (role) user.role = role;
    if (typeof isActive === 'boolean') user.isActive = isActive;

    await user.save();
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
