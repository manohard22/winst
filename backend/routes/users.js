const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Update user profile
router.put('/profile', authenticateToken, [
  body('firstName').optional().trim().isLength({ min: 1 }),
  body('lastName').optional().trim().isLength({ min: 1 }),
  body('phone').optional().isMobilePhone(),
  body('dateOfBirth').optional().isISO8601(),
  body('cgpa').optional().isFloat({ min: 0, max: 10 })
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

    const {
      firstName,
      lastName,
      phone,
      dateOfBirth,
      gender,
      address,
      city,
      state,
      country,
      pincode,
      collegeName,
      degree,
      branch,
      yearOfStudy,
      cgpa,
      linkedinUrl,
      githubUrl,
      portfolioUrl
    } = req.body;

    const result = await pool.query(`
      UPDATE users SET
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        phone = COALESCE($3, phone),
        date_of_birth = COALESCE($4, date_of_birth),
        gender = COALESCE($5, gender),
        address = COALESCE($6, address),
        city = COALESCE($7, city),
        state = COALESCE($8, state),
        country = COALESCE($9, country),
        pincode = COALESCE($10, pincode),
        college_name = COALESCE($11, college_name),
        degree = COALESCE($12, degree),
        branch = COALESCE($13, branch),
        year_of_study = COALESCE($14, year_of_study),
        cgpa = COALESCE($15, cgpa),
        linkedin_url = COALESCE($16, linkedin_url),
        github_url = COALESCE($17, github_url),
        portfolio_url = COALESCE($18, portfolio_url),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $19
      RETURNING id, email, first_name, last_name, phone, role
    `, [
      firstName, lastName, phone, dateOfBirth, gender,
      address, city, state, country, pincode,
      collegeName, degree, branch, yearOfStudy, cgpa,
      linkedinUrl, githubUrl, portfolioUrl, req.user.id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = result.rows[0];
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

module.exports = router;
