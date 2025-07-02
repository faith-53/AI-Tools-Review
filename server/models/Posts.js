const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  text: String,
  date: { type: Date, default: Date.now },
  author: String,
  authorEmail: String
});

const sectionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["text", "list", "tool", "image", "checklist", "heading"],
    required: true
  },
  content: String, // for text, heading, or image URL
  items: [String], // for lists or checklists
  tool: {
    name: String,
    bestFor: String,
    pros: [String],
    cons: [String]
  }
}, { _id: false });

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: String,
  tags: [String],
  image: String, // main/cover image
  comments: [commentSchema],
  likes: [String],
  sections: [sectionSchema],
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Post", postSchema);
