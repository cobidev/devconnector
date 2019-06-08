const express = require('express');
const router = express.Router();
const { verifyAuth } = require('../../middleware/auth');

const User = require('../../models/User');

// @route   GET api/auth
// @desc    Test route
// @access  Private
router.get('/', verifyAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userID).select('-password');
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
