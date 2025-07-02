const Post = require('../models/Posts.js');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Add a new post
exports.addPost = async (req, res) => {
  try {
    const { title, summary, tags, sections } = req.body;
    let image = null;
    if (req.file) {
      // Convert to WebP and compress
      const inputPath = req.file.path;
      const outputFilename = `${Date.now()}-converted.webp`;
      const outputPath = path.join(path.dirname(inputPath), outputFilename);
      await sharp(inputPath)
        .webp({ quality: 80 })
        .resize({ width: 1200, withoutEnlargement: true })
        .toFile(outputPath);
      // Delete original upload
      fs.unlinkSync(inputPath);
      image = outputFilename;
    }
    let sectionsArr = sections;
    if (typeof sections === 'string') sectionsArr = JSON.parse(sections);
    const newPost = new Post({ title, summary, tags, image, sections: sectionsArr });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Error adding post', error });
  }
};

// Edit an existing post
exports.editPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, summary, tags, sections } = req.body;
    let sectionsArr = sections;
    if (typeof sections === 'string') sectionsArr = JSON.parse(sections);
    const update = { title, summary, tags, sections: sectionsArr };
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      update,
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error editing post', error });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error });
  }
};

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error });
  }
};

// Get a single post by ID
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error });
  }
};

// Add a comment to a post
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const comment = { 
      text, 
      author: req.user._id.toString(),
      authorEmail: req.user.email,
      date: new Date() 
    };
    post.comments.push(comment);
    await post.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error });
  }
};

// Get comments for a post
exports.getComments = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post.comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error });
  }
};

// Edit a comment on a post
exports.editComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { text } = req.body;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    // Only author or admin can edit
    if (
      (!req.user) ||
      (comment.author !== req.user.id && comment.author !== req.user._id?.toString() && req.user.role !== 'admin')
    ) {
      return res.status(403).json({ message: 'Forbidden: not comment author or admin' });
    }
    comment.text = text;
    await post.save();
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Error editing comment', error });
  }
};

// Delete a comment on a post
exports.deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    // Only author or admin can delete
    if (
      (!req.user) ||
      (comment.author !== req.user.id && comment.author !== req.user._id?.toString() && req.user.role !== 'admin')
    ) {
      return res.status(403).json({ message: 'Forbidden: not comment author or admin' });
    }
    comment.remove();
    await post.save();
    res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error });
  }
};

// Like a post
exports.likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user._id.toString();
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
      await post.save();
    }
    res.status(200).json({ likes: post.likes.length, liked: true });
  } catch (error) {
    res.status(500).json({ message: 'Error liking post', error });
  }
};

// Unlike a post
exports.unlikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user._id.toString();
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.likes = post.likes.filter(uid => uid !== userId);
    await post.save();
    res.status(200).json({ likes: post.likes.length, liked: false });
  } catch (error) {
    res.status(500).json({ message: 'Error unliking post', error });
  }
};
