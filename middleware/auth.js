const jwt = require('jsonwebtoken');
const config = require('config');

const verifyAuth = (req, res, next) => {
  // Get the token from the header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authoriztion denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecretKey'));
    req.userID = decoded.userID;
    next();
  } catch (err) {
    console.log(err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = {
  verifyAuth
};
