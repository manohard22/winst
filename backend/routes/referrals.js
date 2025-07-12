const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const crypto = require('crypto');

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

module.exports = router;
