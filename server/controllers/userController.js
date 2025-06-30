const User = require('../models/User');
const Post = require('../models/Posts');

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
};

// Get user's posts
exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.id })
      .sort({ date: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user posts', error: error.message });
  }
};

// Get user's comments
exports.getUserComments = async (req, res) => {
  try {
    const posts = await Post.find({ 'comments.author': req.params.id });
    
    // Extract and format comments
    const comments = posts.reduce((acc, post) => {
      const userComments = post.comments
        .filter(comment => comment.author === req.params.id)
        .map(comment => ({
          ...comment.toObject(),
          postId: post._id,
          postTitle: post.title
        }));
      return [...acc, ...userComments];
    }, []);

    // Sort by date descending
    comments.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user comments', error: error.message });
  }
};