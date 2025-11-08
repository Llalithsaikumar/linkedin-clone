// server/db.js
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn('Warning: MONGODB_URI is not set. DB operations will fail until set in env.');
}

/**
 * connectDB()
 * - Reuses a global promise to avoid opening many connections in serverless envs
 * - Returns a Promise that resolves to mongoose.connection or rejects with error
 */
function connectDB() {
  if (!MONGODB_URI) {
    return Promise.reject(new Error('MONGODB_URI not configured'));
  }

  if (mongoose.connection.readyState >= 1) {
    // already connected
    return Promise.resolve(mongoose.connection);
  }

  if (!global._mongoConnectPromise) {
    global._mongoConnectPromise = mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(() => {
      console.log('MongoDB connected (db.js)');
      return mongoose.connection;
    }).catch(err => {
      // Remove cached promise so future attempts can retry
      global._mongoConnectPromise = null;
      console.error('MongoDB connection error (db.js):', err.message || err);
      throw err;
    });
  }

  return global._mongoConnectPromise;
}

module.exports = connectDB;
