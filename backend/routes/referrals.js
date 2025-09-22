const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const crypto = require('crypto');
const { sendMail } = require('../utils/mailer');

const router = express.Router();

// Generate referral code
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Generate unique referral code
    const referralCode = 'REF' + crypto.randomBytes(4).toString('hex').toUpperCase();
    
    // Check if referral already exists for this email
    const existingReferral = await pool.query(
      'SELECT id FROM referrals WHERE referrer_id = $1 AND referred_email = $2',
      [req.user.id, email]
    );

    if (existingReferral.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Referral already exists for this email'
      });
    }

    // Create referral
    const result = await pool.query(`
      INSERT INTO referrals (referrer_id, referred_email, referral_code, expires_at)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [req.user.id, email, referralCode, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)]);
        console.log("process.env.SMTP_USER :", process.env.SMTP_USER );
        console.log("process.env.FRONTEND_URL :", process.env.FRONTEND_URL );

    // Fire-and-forget emails (do not block response)
    (async () => {
      try {
        const signupUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/signup?ref=${referralCode}`;
        // Invitation to referred person
        await sendMail({
          to: email,
          subject: 'You have been invited to join Winst! 🎓',
          html: `
            <div style="font-family:Arial,sans-serif;line-height:1.6">
              <h2>Join Winst and get ₹499 off!</h2>
              <p>Your friend invited you to Winst. Use their referral link to sign up and claim your discount:</p>
              <p><a href="${signupUrl}" style="background:#2563eb;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none">Claim your discount</a></p>
              <p>Or copy this code: <b>${referralCode}</b></p>
            </div>
          `,
          text: `Join Winst with referral ${referralCode}. Sign up: ${signupUrl}`,
        });

        // Confirmation to referrer (if we can fetch their email)
        const refUser = await pool.query('SELECT email, first_name FROM users WHERE id = $1', [req.user.id]);
        const refEmail = refUser.rows[0]?.email;
        if (refEmail) {
          await sendMail({
            to: refEmail,
            subject: 'Your referral invite was sent ✅',
            html: `
              <div style="font-family:Arial,sans-serif;line-height:1.6">
                <p>We sent your invite to <b>${email}</b>.</p>
                <p>Referral code: <b>${referralCode}</b></p>
              </div>
            `,
            text: `We sent your invite to ${email}. Referral code: ${referralCode}`,
          });
        }
      } catch (e) {
        console.error('Referral email send error:', e.message);
      }
    })();

    res.status(201).json({
      success: true,
      message: 'Referral code generated successfully',
      data: {
        referralCode,
        expiresAt: result.rows[0].expires_at
      }
    });
  } catch (error) {
    console.error('Generate referral error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate referral code'
    });
  }
});

// Get user's referrals
router.get('/my-referrals', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        r.*,
        u.first_name,
        u.last_name,
        u.email as referred_user_email
      FROM referrals r
      LEFT JOIN users u ON r.referred_user_id = u.id
      WHERE r.referrer_id = $1
      ORDER BY r.created_at DESC
    `, [req.user.id]);

    res.json({
      success: true,
      data: {
        referrals: result.rows.map(referral => ({
          id: referral.id,
          referredEmail: referral.referred_email,
          referralCode: referral.referral_code,
          status: referral.status,
          discountAmount: parseFloat(referral.discount_amount),
          usedAt: referral.used_at,
          expiresAt: referral.expires_at,
          referredUser: referral.referred_user_id ? {
            firstName: referral.first_name,
            lastName: referral.last_name,
            email: referral.referred_user_email
          } : null,
          createdAt: referral.created_at
        }))
      }
    });
  } catch (error) {
    console.error('Get referrals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch referrals'
    });
  }
});

// Validate referral code
router.post('/validate', async (req, res) => {
  try {
    const { referralCode } = req.body;
    
    if (!referralCode) {
      return res.status(400).json({
        success: false,
        message: 'Referral code is required'
      });
    }

    const result = await pool.query(`
      SELECT r.*, u.first_name, u.last_name
      FROM referrals r
      JOIN users u ON r.referrer_id = u.id
      WHERE r.referral_code = $1 AND r.status = 'pending' AND r.expires_at > CURRENT_TIMESTAMP
    `, [referralCode]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Invalid or expired referral code'
      });
    }

    const referral = result.rows[0];

    res.json({
      success: true,
      data: {
        referralCode: referral.referral_code,
        discountAmount: parseFloat(referral.discount_amount),
        referrerName: `${referral.first_name} ${referral.last_name}`,
        expiresAt: referral.expires_at
      }
    });
  } catch (error) {
    console.error('Validate referral error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate referral code'
    });
  }
});

// Resend referral invite email
router.post('/resend', authenticateToken, async (req, res) => {
  try {
    const { referralId } = req.body;
    if (!referralId) {
      return res.status(400).json({ success: false, message: 'referralId is required' });
    }

    const result = await pool.query(
      `SELECT r.referral_code, r.referred_email, r.status, u.first_name, u.last_name
       FROM referrals r JOIN users u ON r.referrer_id = u.id
       WHERE r.id = $1 AND r.referrer_id = $2`,
      [referralId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Referral not found' });
    }

    const r = result.rows[0];
    if (r.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Only pending referrals can be resent' });
    }

    const signupUrl = `${process.env.PUBLIC_APP_URL || 'http://localhost:5173'}/signup?ref=${r.referral_code}`;
    await sendMail({
      to: r.referred_email,
      subject: `Reminder: Join Winst with your referral code ${r.referral_code}`,
      html: `<p>Hi,</p>
             <p>This is a reminder to join Winst using your referral code <strong>${r.referral_code}</strong> to claim your discount.</p>
             <p>Sign up here: <a href="${signupUrl}">${signupUrl}</a></p>
             <p>Thanks,<br/>Winst Team</p>`,
    });

    res.json({ success: true, message: 'Referral invite resent' });
  } catch (error) {
    console.error('Resend referral invite error:', error);
    res.status(500).json({ success: false, message: 'Failed to resend invite' });
  }
});
module.exports = router;
