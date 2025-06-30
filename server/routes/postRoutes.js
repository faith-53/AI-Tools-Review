const express = require('express');
const router = express.Router();
const { addPost, editPost, deletePost, getAllPosts, getPostById, addComment, getComments, editComment, deleteComment, likePost, unlikePost } = require('../controllers/postController');
const multer = require('multer');
const path = require('path');
const { protect, authorizeRoles } = require('../middlewares/auth');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// 2MB file size limit
const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

// Get all posts
router.get('/', getAllPosts);

// Get a single post by ID
router.get('/:id', getPostById);

// Add a new post
router.post('/', protect, authorizeRoles('admin'), upload.single('image'), addPost);

// Edit a post
router.put('/:id', protect, authorizeRoles('admin'), editPost);

// Delete a post
router.delete('/:id', protect, authorizeRoles('admin'), deletePost);

// Comments for a post
router.get('/:id/comments', getComments);
router.post('/:id/comments', protect, addComment);

// Edit and delete comment
router.put('/:postId/comments/:commentId', protect, editComment);
router.delete('/:postId/comments/:commentId', protect, deleteComment);

// Like/unlike a post
router.post('/:id/like', protect, likePost);
router.post('/:id/unlike', protect, unlikePost);

module.exports = router;

