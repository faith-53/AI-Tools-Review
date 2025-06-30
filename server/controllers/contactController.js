const sendEmail = require('../config/email');

exports.sendContactMessage = async (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Check if required environment variables are set
  if (!process.env.CONTACT_RECEIVER_EMAIL) {
    console.error('Missing CONTACT_RECEIVER_EMAIL environment variable');
    return res.status(500).json({ error: 'Contact email configuration is missing.' });
  }

  if (!process.env.SMTP_USERNAME || !process.env.EMAIL_PASS) {
    console.error('Missing email configuration: SMTP_USERNAME or SMTP_PASSWORD');
    return res.status(500).json({ error: 'Email service configuration is missing.' });
  }

  try {
    console.log('Attempting to send contact email...');
    console.log('Receiver email:', process.env.CONTACT_RECEIVER_EMAIL);
    
    await sendEmail({
      email: process.env.CONTACT_RECEIVER_EMAIL, // Admin/receiver
      subject: `New Contact Message from ${name}`,
      message: `
        <h3>Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `
    });
    
    console.log('Contact email sent successfully');
    res.status(200).json({ message: 'Message sent successfully.' });
  } catch (err) {
    console.error('Contact email error:', err);
    res.status(500).json({ 
      error: 'Failed to send message.',
      details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
}; 