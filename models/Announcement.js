const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please enter announcement title'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Please enter announcement content'],
    },
    type: {
      type: String,
      enum: ['info', 'warning', 'urgent'],
      default: 'info',
    },
    targetRole: {
      type: String,
      enum: ['all', 'user', 'support_staff', 'admin'],
      default: 'all',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Announcement', announcementSchema);
