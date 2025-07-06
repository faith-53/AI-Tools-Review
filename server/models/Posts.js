const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  text: String,
  date: { type: Date, default: Date.now },
  author: String,
  authorEmail: String
});



const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: String,
  content: { type: String, required: true },
  tags: [String],
  image: String, // main/cover image\
  comments: [commentSchema],
  likes: [String],
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Post", postSchema);
