const Ticket = require('../models/Ticket');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Create a new support ticket
// @route   POST /api/tickets
// @access  Private
exports.createTicket = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      locationAddress,
      contactPhone,
      preferredDate,
      preferredTimeSlot,
      assignedTechName,
    } = req.body;

    // Handle uploaded attachments if present
    const attachments = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        attachments.push({
          filename: file.originalname,
          filepath: file.path,
          mimetype: file.mimetype,
        });
      });
    }

    const ticket = await Ticket.create({
      title,
      description,
      category: category || 'Laptop Repair & Diagnostics',
      priority: priority || 'Medium',
      user: req.user.id,
      locationAddress: locationAddress || 'On-Site',
      contactPhone: contactPhone || req.user.phone || '',
      preferredDate: preferredDate || Date.now(),
      preferredTimeSlot: preferredTimeSlot || 'Morning (9 AM - 12 PM)',
      assignedTechName: assignedTechName || 'First Available Tech',
      attachments,
      history: [
        {
          status: 'Open',
          updatedBy: req.user.name,
          notes: 'Ticket submitted via ecosystem portal.',
        },
      ],
    });

    // Notify all admins about new ticket
    const admins = await User.find({ role: 'admin' });
    const notifications = admins.map((admin) => ({
      user: admin._id,
      title: '⚡ New Ticket Created',
      message: `New ticket ${ticket.ticketId}: "${ticket.title}" submitted by ${req.user.name}`,
      type: 'new_ticket',
      link: `#tracker`,
    }));
    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(201).json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's tickets or all tickets (if support/admin)
// @route   GET /api/tickets
// @access  Private
exports.getTickets = async (req, res) => {
  try {
    let query;

    // Users see their own tickets; admins and staff see all tickets
    if (req.user.role === 'admin' || req.user.role === 'support_staff') {
      query = Ticket.find();
    } else {
      query = Ticket.find({ user: req.user.id });
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Filter by status if provided
    if (req.query.status) {
      query = query.find({ status: req.query.status });
    }

    // Filter by priority if provided
    if (req.query.priority) {
      query = query.find({ priority: req.query.priority });
    }

    const total = await Ticket.countDocuments(query.getFilter());
    const tickets = await query.sort({ createdAt: -1 }).skip(startIndex).limit(limit).populate('user', 'name email');

    res.status(200).json({
      success: true,
      count: tickets.length,
      total,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
      },
      tickets,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single ticket by ID or ticketId
// @route   GET /api/tickets/:id
// @access  Public / Private
exports.getTicketById = async (req, res) => {
  try {
    const identifier = req.params.id;

    let ticket;
    // Check if searching by MongoDB ObjectId or string ticketId (e.g. TECH-8842)
    if (identifier.startsWith('TECH-')) {
      ticket = await Ticket.findOne({ ticketId: identifier }).populate('user', 'name email');
    } else {
      ticket = await Ticket.findById(identifier).populate('user', 'name email');
    }

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    res.status(200).json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update ticket status / assignment
// @route   PUT /api/tickets/:id
// @access  Private (Support Staff / Admin)
exports.updateTicket = async (req, res) => {
  try {
    let ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const { status, priority, assignedTo, assignedTechName, notes } = req.body;

    const oldStatus = ticket.status;

    if (status) ticket.status = status;
    if (priority) ticket.priority = priority;
    if (assignedTo) ticket.assignedTo = assignedTo;
    if (assignedTechName) ticket.assignedTechName = assignedTechName;

    // Append to history
    ticket.history.push({
      status: ticket.status,
      updatedBy: req.user.name,
      notes: notes || `Status updated from ${oldStatus} to ${ticket.status}`,
    });

    await ticket.save();

    // Send Notification to ticket owner if status changed
    if (status && status !== oldStatus) {
      await Notification.create({
        user: ticket.user,
        title: `Ticket Status Updated: ${ticket.ticketId}`,
        message: `Your support ticket status has been changed to "${ticket.status}".`,
        type: 'ticket_status',
        link: `#tracker`,
      });
    }

    res.status(200).json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add comment / reply to ticket
// @route   POST /api/tickets/:id/comments
// @access  Private
exports.addTicketComment = async (req, res) => {
  try {
    const { text } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const newComment = {
      user: req.user.id,
      userName: req.user.name,
      userRole: req.user.role,
      text,
    };

    ticket.comments.push(newComment);
    await ticket.save();

    res.status(200).json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Close ticket
// @route   PUT /api/tickets/:id/close
// @access  Private
exports.closeTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    ticket.status = 'Closed';
    ticket.history.push({
      status: 'Closed',
      updatedBy: req.user.name,
      notes: 'Ticket closed by user/staff.',
    });

    await ticket.save();

    res.status(200).json({ success: true, message: 'Ticket closed successfully', ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
