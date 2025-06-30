const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    secure: true,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.EMAIL_PASS
    }
  });

  // Define email options
  const mailOptions = {
    from: options.from || `<${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
    attachments: options.attachments
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;