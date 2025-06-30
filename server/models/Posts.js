const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  text: String,
  date: { type: Date, default: Date.now },
  author: String,
  authorEmail: String
});

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  image: String,
  comments: [commentSchema],
  likes: [String],
  pros: [String],
  cons: [String],
});

module.exports = mongoose.model("Post", postSchema);
