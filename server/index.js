// server/index.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const app = express();
app.use(express.json());

// CORS - allow the client origin from env or localhost
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));

// Basic routes
app.get('/api/health', async (req, res) => {
  // Attempt to check DB state but never let it crash the function
  try {
    const conn = await connectDB().catch(err => null);
    const dbState = ((conn && conn.readyState) !== undefined) ? conn.readyState : (conn ? conn : null);
    return res.json({
      status: 'ok',
      time: new Date().toISOString(),
      dbReadyState: dbState
    });
  } catch (err) {
    console.error('Health route error:', err);
    return res.status(200).json({
      status: 'ok',
      time: new Date().toISOString(),
      dbReadyState: null,
      warning: 'DB check failed'
    });
  }
});

// Example auth route placeholder (keep your real auth routes)
app.post('/api/auth/login', async (req, res) => {
  console.log('Login request body:', req.body);
  try {
    // If your login needs DB, ensure connectDB() resolves first:
    await connectDB();
    // ... your login logic here ...
    res.json({ ok: true, message: 'login route reached (placeholder)' });
  } catch (err) {
    console.error('Login error:', err.stack || err.message || err);
    res.status(500).json({ error: 'server error', detail: err.message });
  }
});

// Export app (so local runs still work)
module.exports = app;

// Run locally when invoked directly
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running locally on ${PORT}`));
}
