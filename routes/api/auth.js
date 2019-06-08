const express = require('express');
const router = express.Router();
const { verifyAuth } = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');

const User = require('../../models/User');

// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get('/', verifyAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userID).select('-password');
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    // Validate Data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Login User
    try {
      // check if user exists
      let user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      // check if password match
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      // return jsonwebtoken
      const payload = { userID: user._id };
      const token = await jwt.sign(payload, config.get('jwtSecretKey'), {
        expiresIn: 360000
      });

      res.json({ token });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ msg: 'Server error.' });
    }
  }
);

module.exports = router;
