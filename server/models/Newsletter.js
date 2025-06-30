const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  confirmToken: String,
});

module.exports = mongoose.model('Newsletter', newsletterSchema); 