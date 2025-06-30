const Newsletter = require('../models/Newsletter');
const sendEmail = require('../config/email');
const crypto = require('crypto');

// Simple email regex for validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.signup = async (req, res) => {
  const { email } = req.body;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email address.' });
  }
  try {
    // Prevent duplicate signups
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already subscribed.' });
    }
    // Generate confirmation token
    const confirmToken = crypto.randomBytes(32).toString('hex');
    const signup = new Newsletter({ email, confirmToken, confirmed: false });
    await signup.save();
    // Send confirmation email
    try {
      const confirmUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/newsletter-confirm?token=${confirmToken}&email=${encodeURIComponent(email)}`;
      await sendEmail({
        email,
        subject: 'Confirm your subscription to AI Tools Review Newsletter',
        message: `<h2>Confirm your subscription</h2><p>Thank you for signing up! Please <a href="${confirmUrl}">click here to confirm your subscription</a> to start receiving our newsletter.</p><p>If you did not subscribe, you can ignore this email.</p>`
      });
    } catch (e) {
      console.error('Failed to send confirmation email:', e);
    }
    res.status(201).json({ message: 'Please check your email to confirm your subscription.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

exports.confirm = async (req, res) => {
  const { token, email } = req.query;
  if (!token || !email) {
    return res.status(400).json({ message: 'Invalid confirmation link.' });
  }
  try {
    const subscriber = await Newsletter.findOne({ email, confirmToken: token });
    if (!subscriber) {
      return res.status(400).json({ message: 'Invalid or expired confirmation link.' });
    }
    if (subscriber.confirmed) {
      return res.status(200).json({ message: 'Subscription already confirmed.' });
    }
    subscriber.confirmed = true;
    subscriber.confirmToken = undefined;
    await subscriber.save();
    res.status(200).json({ message: 'Subscription confirmed! Thank you.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

exports.getAll = async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const all = await Newsletter.find().sort({ date: -1 });
    res.json(all);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.delete = async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    await Newsletter.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
}; 