const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: String,
  userRole: String,
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ticketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please enter a ticket title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please describe the technical issue'],
    },
    category: {
      type: String,
      required: true,
      default: 'Hardware & Diagnostic',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
      default: 'Open',
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    assignedTechName: {
      type: String,
      default: 'Unassigned',
    },
    locationAddress: {
      type: String,
      default: 'On-Site',
    },
    contactPhone: {
      type: String,
      default: '',
    },
    preferredDate: {
      type: Date,
      default: Date.now,
    },
    preferredTimeSlot: {
      type: String,
      default: 'Morning (9 AM - 12 PM)',
    },
    attachments: [
      {
        filename: String,
        filepath: String,
        mimetype: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    comments: [commentSchema],
    history: [
      {
        status: String,
        updatedBy: String,
        notes: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Auto-generate ticketId before validation if not present
ticketSchema.pre('validate', async function (next) {
  if (!this.ticketId) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    this.ticketId = `TECH-${randomNum}`;
  }
  next();
});

module.exports = mongoose.model('Ticket', ticketSchema);
