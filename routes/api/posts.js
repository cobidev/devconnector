const express = require('express');
const router = express.Router();
const { verifyAuth } = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post(
  '/',
  verifyAuth,
  [
    check('text', 'Text is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    // Validate data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.userID).select('-password');
      // Create new Post from req.body & user model
      const post = new Post({
        user: user._id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar
      });

      // Save the new Post in DB
      const createdPost = await post.save();

      // Return that created Post
      res.json(createdPost);
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ msg: 'Server Error.' });
    }
  }
);

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get('/', verifyAuth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });

    // Return all posts
    res.json(posts);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Server Error.' });
  }
});

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Private
router.get('/:id', verifyAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if post exists
    if (!post) {
      return res.status(404).json({ msg: 'Post not found.' });
    }

    // Return post
    res.json(post);
  } catch (err) {
    console.log(err.message);
    // Check if the error was triggered by ObjectId
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found.' });
    }
    res.status(500).json({ msg: 'Server Error.' });
  }
});

// @route   DELETE api/posts/:id
// @desc    Delete post by id
// @access  Private
router.delete('/:id', verifyAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if post exists
    if (!post) {
      return res.status(404).json({ msg: 'Post not found.' });
    }
    // Check post owner from by checking logged in User
    if (post.user.toString() !== req.userID) {
      return res.status(401).json({ msg: 'User not authorized.' });
    }

    // Remove post from DB
    await post.remove();

    // Return success message
    res.json({ msg: 'Post removed!' });
  } catch (err) {
    console.log(err.message);
    // Check if the error was triggered by ObjectId
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found.' });
    }
    res.status(500).json({ msg: 'Server Error.' });
  }
});

// @route   PUT api/posts/:id/like
// @desc    Like a post
// @access  Private
router.put('/:id/like', verifyAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked from current logged user
    if (
      post.likes.filter(like => like.user.toString() === req.userID).length > 0
    ) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    // Add like to post array
    post.likes.unshift({ user: req.userID });

    // Save post to DB
    await post.save();

    // Return post's likes
    res.json(post.likes);
  } catch (err) {
    console.log(err.message);
    // Check if the error was triggered by ObjectId
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found.' });
    }
    res.status(500).json({ msg: 'Server Error.' });
  }
});

// @route   PUT api/posts/:id/unlike
// @desc    Unlike a post
// @access  Private
router.put('/:id/unlike', verifyAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked from current logged user
    if (
      post.likes.filter(like => like.user.toString() === req.userID).length ===
      0
    ) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }

    // Get updated likes (remove like from current logged user)
    post.likes = post.likes.filter(like => like.user.toString() !== req.userID);

    // Save post to DB
    await post.save();

    // Return post's likes
    res.json(post.likes);
  } catch (err) {
    console.log(err.message);
    // Check if the error was triggered by ObjectId
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found.' });
    }
    res.status(500).json({ msg: 'Server Error.' });
  }
});

module.exports = router;
