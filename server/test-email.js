const nodemailer = require('nodemailer');
const path = require('path');

// Load environment variables with explicit path
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Create test transporter
const testTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function testEmail() {
  try {
    console.log('Testing email configuration...');
    console.log('Current directory:', __dirname);
    console.log('Looking for .env file at:', path.join(__dirname, '.env'));
    console.log('Email User:', process.env.EMAIL_USER);
    console.log('Email Pass:', process.env.EMAIL_PASS ? '***configured***' : 'NOT CONFIGURED');
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ Email configuration missing!');
      console.log('Please set EMAIL_USER and EMAIL_PASS in your .env file');
      console.log('Make sure your .env file is in the server directory');
      return;
    }

    // Test the connection
    console.log('\n🔍 Testing SMTP connection...');
    await testTransporter.verify();
    console.log('✅ SMTP connection successful!');

    // Send test email
    console.log('\n📧 Sending test email...');
    const testEmail = await testTransporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself for testing
      subject: 'Test Email - AI Tools Review Site',
      html: `
        <h2>Test Email</h2>
        <p>This is a test email to verify your email configuration is working properly.</p>
        <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
        <p>If you received this email, your newsletter functionality should work correctly!</p>
      `
    });

    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', testEmail.messageId);
    console.log('\n📬 Check your inbox for the test email.');
    console.log('If you received it, your newsletter signup emails should work properly!');

  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔧 Common solutions:');
      console.log('1. Make sure you enabled 2-Factor Authentication on your Gmail account');
      console.log('2. Generate an App Password:');
      console.log('   - Go to Google Account settings');
      console.log('   - Security → 2-Step Verification → App passwords');
      console.log('   - Generate a new app password for "Mail"');
      console.log('3. Use the app password (not your regular password) in EMAIL_PASS');
    } else if (error.code === 'ECONNECTION') {
      console.log('\n🔧 Network connection issue. Check your internet connection.');
    }
  } finally {
    process.exit(0);
  }
}

// Run the test
testEmail(); 