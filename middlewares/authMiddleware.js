const jwt = require('jsonwebtoken');
const config = require('../config/config');

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  console.log('token',token);

  if (!token) {
    return res.status(403).json({ message: 'Token not provided' });
  }

  jwt.verify(token, config.secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }
    req.user = decoded;
    next();
  });
}

module.exports = { verifyToken };
