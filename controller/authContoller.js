const jwt = require('jsonwebtoken');
const config = require('../config/config');

function login(req, res) {
  // Logic to verify user credentials and generate a JWT token
  const user = { id: 1, username: 'example' };
  const token = jwt.sign(user, config.secretKey, { expiresIn: '1h' });
  res.json({ token });
}

module.exports = { login };
