// server/api/index.js
const app = require('../index'); // path to your express app
module.exports = (req, res) => {
  // express app is a function that can handle req/res
  return app(req, res);
};
