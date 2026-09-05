const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Ensure dotenv is loaded from current working directory
dotenv.config({ path: path.join(__dirname, '../.env') });

/**
 * Mask password in MongoDB URI for safe logging
 */
const getMaskedURI = (uri) => {
  if (!uri) return 'UNDEFINED';
  return uri.replace(/\/\/(.*):(.*)@/, (match, user, pass) => `//${user}:****@`);
};

/**
 * Connect to MongoDB Atlas using Mongoose
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  console.log(`\n==================================================`);
  console.log(`🔍 Environment Check:`);
  console.log(`📌 Directory: ${path.resolve(__dirname, '..')}`);
  console.log(`📌 Dotenv Loaded: ${!!process.env.MONGODB_URI ? 'YES' : 'NO'}`);
  console.log(`📌 MONGODB_URI: ${getMaskedURI(uri)}`);
  console.log(`==================================================\n`);

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables or .env file!');
  }

  // Validate format for accidental template placeholder brackets
  if (uri.includes('<') || uri.includes('>')) {
    console.error('❌ CRITICAL ERROR: MONGODB_URI contains unescaped placeholder brackets `<` or `>`.');
    console.error('👉 Fix: Remove `<` and `>` around your username or password in .env.');
    throw new Error('Invalid connection string format: Contains placeholder brackets < >');
  }

  try {
    const conn = await mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 10000, // 10 second timeout
    });

    console.log(`==================================================`);
    console.log(`✅ MongoDB Connection Status: Connected`);
    console.log(`📁 Database Name: ${conn.connection.name}`);
    console.log(`🌐 Cluster Host: ${conn.connection.host}`);
    console.log(`==================================================\n`);

    return conn;
  } catch (error) {
    console.error(`==================================================`);
    console.error(`❌ MongoDB Atlas Connection Error Stack:`);
    console.error(error.stack || error);
    console.error(`==================================================\n`);
    throw error;
  }
};

module.exports = connectDB;
