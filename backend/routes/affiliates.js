const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const crypto = require('crypto');

const router = express.Router();

// Apply for affiliate program
router.post('/apply', authenticateToken, async (req, res) => {
  try {
    // Check if user already has affiliate account
    const existingAffiliate = await pool.query(
      'SELECT id FROM affiliates WHERE user_id = $1',
      [req.user.id]
    );

    if (existingAffiliate.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You already have an affiliate account'
      });
    }

    // Generate unique affiliate code
    const affiliateCode = 'AFF' + crypto.randomBytes(4).toString('hex').toUpperCase();
    
    // Create affiliate account
    const result = await pool.query(`
      INSERT INTO affiliates (user_id, affiliate_code)
      VALUES ($1, $2)
      RETURNING *
    `, [req.user.id, affiliateCode]);

    res.status(201).json({
      success: true,
      message: 'Affiliate account created successfully',
      data: {
        affiliateCode,
        commissionRate: 25.00
      }
    });
  } catch (error) {
    console.error('Affiliate application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create affiliate account'
    });
  }
});

// Get affiliate dashboard
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const affiliateResult = await pool.query(
      'SELECT * FROM affiliates WHERE user_id = $1',
      [req.user.id]
    );

    if (affiliateResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Affiliate account not found'
      });
    }

    const affiliate = affiliateResult.rows[0];

    // Get earnings
    const earningsResult = await pool.query(`
      SELECT 
        ae.*,
        o.order_number,
        o.final_amount,
        u.first_name,
        u.last_name
      FROM affiliate_earnings ae
      JOIN orders o ON ae.order_id = o.id
      JOIN users u ON o.student_id = u.id
      WHERE ae.affiliate_id = $1
      ORDER BY ae.created_at DESC
    `, [affiliate.id]);

    res.json({
      success: true,
      data: {
        affiliate: {
          id: affiliate.id,
          affiliateCode: affiliate.affiliate_code,
          commissionRate: parseFloat(affiliate.commission_rate),
          totalReferrals: affiliate.total_referrals,
          totalEarnings: parseFloat(affiliate.total_earnings),
          status: affiliate.status
        },
        earnings: earningsResult.rows.map(earning => ({
          id: earning.id,
          orderNumber: earning.order_number,
          orderAmount: parseFloat(earning.final_amount),
          commissionAmount: parseFloat(earning.commission_amount),
          status: earning.status,
          customerName: `${earning.first_name} ${earning.last_name}`,
          paidAt: earning.paid_at,
          createdAt: earning.created_at
        }))
      }
    });
  } catch (error) {
    console.error('Affiliate dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch affiliate dashboard'
    });
  }
});

// Validate affiliate code
router.post('/validate', async (req, res) => {
  try {
    const { affiliateCode } = req.body;
    
    if (!affiliateCode) {
      return res.status(400).json({
        success: false,
        message: 'Affiliate code is required'
      });
    }

    const result = await pool.query(`
      SELECT a.*, u.first_name, u.last_name
      FROM affiliates a
      JOIN users u ON a.user_id = u.id
      WHERE a.affiliate_code = $1 AND a.status = 'active'
    `, [affiliateCode]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Invalid affiliate code'
      });
    }

    const affiliate = result.rows[0];

    res.json({
      success: true,
      data: {
        affiliateCode: affiliate.affiliate_code,
        discountAmount: 499.00,
        affiliateName: `${affiliate.first_name} ${affiliate.last_name}`,
        commissionRate: parseFloat(affiliate.commission_rate)
      }
    });
  } catch (error) {
    console.error('Validate affiliate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate affiliate code'
    });
  }
});

module.exports = router;
