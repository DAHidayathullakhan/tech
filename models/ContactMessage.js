const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please enter email address'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please enter phone number'],
    },
    userRole: {
      type: String,
      default: 'customer',
    },
    serviceTopic: {
      type: String,
      default: 'General Support Inquiry',
    },
    message: {
      type: String,
      required: [true, 'Please enter a message'],
    },
    status: {
      type: String,
      enum: ['New', 'In Progress', 'Replied'],
      default: 'New',
    },
    repliedAt: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
