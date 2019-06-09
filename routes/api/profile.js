const express = require('express');
const router = express.Router();
const { verifyAuth } = require('../../middleware/auth');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GET api/profile/me
// @desc    Get current user profile
// @access  Private
router.get('/me', verifyAuth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.userID }).populate(
      'user',
      ['name', 'avatar']
    );

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Server Error.' });
  }
});

module.exports = router;
