const express = require('express');
const router = express.Router();
const { verifyAuth } = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');
const request = require('request');
const config = require('config');

const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');

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
    // Check for validation errors
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
    profileFields.company = company;
    profileFields.website = website;
    profileFields.location = location;
    profileFields.bio = bio;
    if (status) profileFields.status = status;
    profileFields.githubusername = githubusername;
    // 2.2) set skills into array
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    }
    // 2.3) set social obj
    profileFields.social = {};
    profileFields.social.youtube = youtube;
    profileFields.social.facebook = facebook;
    profileFields.social.twitter = twitter;
    profileFields.social.instagram = instagram;
    profileFields.social.linkedin = linkedin;

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

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get('/', async (req, res) => {
  try {
    // get all profiles from DB
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found' });
    }

    res.json(profile);
  } catch (err) {
    console.log(err.message);
    // Check if the error was triggered by ObjectId
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   DELETE api/profile/
// @desc    Delete profile, user & posts
// @access  Private
router.delete('/', verifyAuth, async (req, res) => {
  try {
    // Remove User Posts
    await Post.deleteMany({ user: req.userID });
    // Remove User Profile
    await Profile.findOneAndRemove({ user: req.userID });
    // Remove User
    await User.findOneAndRemove({ _id: req.userID });

    res.json({ msg: 'User deleted!' });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   PUT api/profile/experience
// @desc    Add profile experience
// @access  Private
router.put(
  '/experience',
  verifyAuth,
  [
    check('title', 'Title is required')
      .not()
      .isEmpty(),
    check('company', 'Company is required')
      .not()
      .isEmpty(),
    check('from', 'From date is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Set new object experience from body to save into DB
    const newExp = {
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description
    };

    try {
      const profile = await Profile.findOne({ user: req.userID });

      profile.experience.unshift(newExp);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ msg: 'Server Error' });
    }
  }
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete('/experience/:exp_id', verifyAuth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.userID });

    // Updated experiences by filtering ( pull out the one we want to delete )
    profile.experience = profile.experience.filter(item => {
      return item.id !== req.params.exp_id;
    });

    // Save the updated profile experience
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   PUT api/profile/education
// @desc    Add profile education
// @access  Private
router.put(
  '/education',
  verifyAuth,
  [
    check('school', 'School is required')
      .not()
      .isEmpty(),
    check('degree', 'Degree is required')
      .not()
      .isEmpty(),
    check('fieldofstudy', 'Field of study is required')
      .not()
      .isEmpty(),
    check('from', 'From date is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Set new object experience from body to save into DB
    const newEduc = {
      school: req.body.school,
      degree: req.body.degree,
      fieldofstudy: req.body.fieldofstudy,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description
    };

    try {
      const profile = await Profile.findOne({ user: req.userID });

      profile.education.unshift(newEduc);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ msg: 'Server Error' });
    }
  }
);

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete('/education/:edu_id', verifyAuth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.userID });

    // Updated educations by filtering ( pull out the one we want to delete )
    profile.education = profile.education.filter(item => {
      return item.id !== req.params.edu_id;
    });

    // Save the updated profile education
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   GET api/profile/github/:username
// @desc    Get user repos from github
// @access  Public
router.get('/github/:username', (req, res) => {
  try {
    // Create API option obj request
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubClientId'
      )}&client_secret=${config.get('githubClientSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    };

    // Request the http call
    request(options, (err, response, body) => {
      if (err) console.log(err);

      if (response.statusCode !== 200) {
        res.status(404).json({ msg: 'No Github profile found' });
      } else {
        res.json(JSON.parse(body));
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
