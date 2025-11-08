// server/api/index.js
const app = require('../index');
const connectDB = require('../db');

module.exports = async (req, res) => {
  try {
    // Try to connect, but if it fails, allow route handlers to proceed (they will handle DB absence).
    await connectDB().catch(err => {
      // Log it — Vercel shows console logs in the deployment logs
      console.error('connectDB() warning in serverless wrapper:', err && err.message ? err.message : err);
      // Do not throw here so function still responds (health route will report DB null)
      return null;
    });
    return app(req, res);
  } catch (err) {
    console.error('Server wrapper error:', err.stack || err);
    res.status(500).json({ error: 'server wrapper error', message: err.message || String(err) });
  }
};
