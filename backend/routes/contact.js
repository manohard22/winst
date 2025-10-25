const express = require('express');
const { body, validationResult } = require('express-validator');
const { sendMail } = require('../utils/mailer');

const router = express.Router();

router.post('/', [
  body('name').trim().isLength({ min: 1 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('subject').trim().isLength({ min: 1 }).escape(),
  body('message').trim().isLength({ min: 1 }).escape(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, subject, message } = req.body;

    await sendMail({
      to: process.env.SMTP_USER,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <p>You have a new contact form submission:</p>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Subject:</strong> ${subject}</li>
          <li><strong>Message:</strong></li>
        </ul>
        <p>${message}</p>
      `
    });

    res.status(200).json({
      success: true,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
});

module.exports = router;
