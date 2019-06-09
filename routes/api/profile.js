const express = require('express');
const router = express.Router();
const { verifyAuth } = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const Profile = require('../../models/Profile');

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

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post(
  '/',
  verifyAuth,
  [
    check('status', 'Status is required')
      .not()
      .isEmpty(),
    check('skills', 'Skills is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // 1) Destructure req.body data
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    // 2) Build profile object
    const profileFields = {};
    // 2.1) set common profile data
    profileFields.user = req.userID;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    // 2.2) set skills into array
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    }
    // 2.3) set social obj
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    // 3) Check if Profile exist or not
    try {
      let profile = await Profile.findOne({ user: req.userID });
      // If Profile already exist, update with new data and return it
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.userID }, // find by current user id
          { $set: profileFields }, // set req.body data
          { new: true }
        );
        return res.json(profile);
      }
      // Create new Profile and return it
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ msg: 'Server Error' });
    }
  }
);

module.exports = router;
