const express = require('express');
const router = express.Router();
const {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  addTicketComment,
  closeTicket,
} = require('../controllers/ticketController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, upload.array('attachments', 5), createTicket);
router.get('/', protect, getTickets);
router.get('/:id', getTicketById);
router.put('/:id', protect, authorizeRoles('support_staff', 'admin'), updateTicket);
router.post('/:id/comments', protect, addTicketComment);
router.put('/:id/close', protect, closeTicket);

module.exports = router;
