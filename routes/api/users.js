const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');

const User = require('../../models/User');

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    // Validate Data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Register User
    try {
      // check if user exists
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      // create the user
      user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        avatar: ''
      });

      // get user gravatar
      const avatarURI = gravatar.url(req.body.email, {
        s: '200', // size
        r: 'pg', // rating
        d: 'mm' // default
      });
      user.avatar = avatarURI;

      // encrypt the password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);

      // save the user
      const savedUser = await user.save();

      // return jsonwebtoken
      const payload = { userID: savedUser._id };
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
