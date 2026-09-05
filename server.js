const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load Environment Variables
dotenv.config();

// Connect to MongoDB Atlas Database
connectDB();

const app = express();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Serve Static Frontend Files & Uploads
app.use(express.static(path.join(__dirname, '/')));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Mount REST API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/kb', require('./routes/kbRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'TechServe Pro Backend Ecosystem Operational',
    environment: process.env.VERCEL ? 'Vercel Serverless' : 'Local Node Server',
    timestamp: new Date(),
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Port listener for local execution (Skipped in Vercel Serverless environment)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 TechServe Pro Backend Server Running!`);
    console.log(`📡 Local Environment: http://localhost:${PORT}`);
    console.log(`🏥 Health Check API:  http://localhost:${PORT}/api/health`);
    console.log(`==================================================`);
  });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`❌ Unhandled Rejection Error: ${err.message}`);
});

// Export Express App for Vercel Serverless deployment
module.exports = app;
