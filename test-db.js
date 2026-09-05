const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

console.log('--------------------------------------------------');
console.log('🔍 RUNNING COMPREHENSIVE MONGODB ATLAS DIAGNOSTIC');
console.log('--------------------------------------------------');

// 1. Check directory
const appDir = path.resolve(__dirname);
console.log(`1. Application Directory: ${appDir}`);

// 2. Load .env
const envPath = path.join(appDir, '.env');
const dotenvResult = dotenv.config({ path: envPath });

if (dotenvResult.error) {
  console.error(`❌ Dotenv Load Error: ${dotenvResult.error.message}`);
} else {
  console.log(`2. Dotenv Loaded Successfully from: ${envPath}`);
}

// 3. Verify MONGODB_URI
const uri = process.env.MONGODB_URI;
const maskedUri = uri ? uri.replace(/\/\/(.*):(.*)@/, (m, u, p) => `//${u}:****@`) : 'NONE';
console.log(`3. MONGODB_URI (Masked): ${maskedUri}`);

// 4. Format validation
let hasBrackets = uri && (uri.includes('<') || uri.includes('>'));
console.log(`4. Connection String Format Valid: ${!hasBrackets ? 'YES' : 'NO (Contains < or > brackets)'}`);

// 5. Connect and report
const connectDB = require('./config/db');

(async () => {
  try {
    const conn = await connectDB();
    console.log('--------------------------------------------------');
    console.log('🎉 DIAGNOSTIC TEST RESULT: SUCCESSFUL CONNECTION');
    console.log(`- Connection Status: Connected`);
    console.log(`- Database Name: ${conn.connection.name}`);
    console.log(`- Cluster Host: ${conn.connection.host}`);
    console.log('--------------------------------------------------');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('--------------------------------------------------');
    console.error('💥 DIAGNOSTIC TEST RESULT: FAILED');
    console.error(`Error Name: ${err.name}`);
    console.error(`Error Message: ${err.message}`);
    console.error('--------------------------------------------------');
    process.exit(1);
  }
})();
