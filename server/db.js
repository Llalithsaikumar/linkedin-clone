// server/db.js
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI not set');
  throw new Error('MONGODB_URI not set');
}

async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }
  // Use a global cache to prevent multiple connections in serverless
  if (!global._mongoPromise) {
    global._mongoPromise = mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(() => mongoose.connection);
  }
  return global._mongoPromise;
}

module.exports = connectDB;
