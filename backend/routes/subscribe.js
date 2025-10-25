const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { sendMail } = require('../utils/mailer');

const router = express.Router();

router.post('/', [
  body('email').isEmail().normalizeEmail(),
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

    const { email } = req.body;

    const existingSubscriber = await pool.query('SELECT id FROM subscribers WHERE email = $1', [email]);

    if (existingSubscriber.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'This email is already subscribed.'
      });
    }

    await pool.query('INSERT INTO subscribers (email) VALUES ($1)', [email]);

    await sendMail({
      to: email,
      subject: 'Subscription Confirmation',
      html: `
        <p>Thank you for subscribing to our newsletter!</p>
        <p>You'll be the first to know about new internship opportunities and career tips.</p>
      `
    });

    res.status(200).json({
      success: true,
      message: 'Subscribed successfully'
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Subscription failed'
    });
  }
});

module.exports = router;
