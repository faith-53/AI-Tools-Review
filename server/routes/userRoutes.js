const express = require('express');
const router = express.Router();
const { getUserProfile, getUserPosts, getUserComments } = require('../controllers/userController');
const { protect } = require('../middlewares/auth');

// Get user profile and activity
router.get('/:id', protect, getUserProfile);
router.get('/:id/posts', protect, getUserPosts);
router.get('/:id/comments', protect, getUserComments);

module.exports = router;