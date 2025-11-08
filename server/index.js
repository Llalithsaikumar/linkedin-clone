// server/index.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const app = express();

app.use(express.json());

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true
}));

// connect to DB (kick it off)
connectDB().then(() => {
  console.log('Mongo connected (init)');
}).catch(err => {
  console.error('Mongo connect error', err);
});

// your routes here, e.g.:
// const authRoutes = require('./routes/auth');
// app.use('/api/auth', authRoutes);

// Export app so serverless wrapper can use it
module.exports = app;

// Optionally start a local server when running locally
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
}
