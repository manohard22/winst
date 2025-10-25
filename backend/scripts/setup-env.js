#!/usr/bin/env node

/**
 * Environment Setup Script
 * Interactive script to help set up environment variables for WINST backend
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const crypto = require('crypto');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function generateSecureSecret(length = 64) {
  return crypto.randomBytes(length).toString('hex');
}

function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

function question(rl, prompt, defaultValue = '') {
  return new Promise((resolve) => {
    const displayDefault = defaultValue ? ` (${defaultValue})` : '';
    rl.question(`${prompt}${displayDefault}: `, (answer) => {
      resolve(answer.trim() || defaultValue);
    });
  });
}

async function setupEnvironment() {
  log('\n🚀 WINST Backend Environment Setup', 'cyan');
  log('='.repeat(50), 'cyan');
  log('This script will help you create a proper .env file for your backend.', 'white');
  log('Press Enter to use default values shown in parentheses.\n', 'yellow');

  const rl = createInterface();
  const envVars = {};

  try {
    // Database Configuration
    log('📊 Database Configuration:', 'magenta');
    envVars.DB_HOST = await question(rl, '  Database Host', 'localhost');
    envVars.DB_PORT = await question(rl, '  Database Port', '5432');
    envVars.DB_NAME = await question(rl, '  Database Name', 'winst_portal_db');
    envVars.DB_USER = await question(rl, '  Database User', 'winst_db_user');
    envVars.DB_PASSWORD = await question(rl, '  Database Password (required)', '');
    
    while (!envVars.DB_PASSWORD) {
      log('  ❌ Database password is required!', 'red');
      envVars.DB_PASSWORD = await question(rl, '  Database Password', '');
    }

    // JWT Configuration
    log('\n🔐 JWT Configuration:', 'magenta');
    const generateSecrets = await question(rl, '  Generate secure JWT secrets automatically? (y/n)', 'y');
    
    if (generateSecrets.toLowerCase() === 'y') {
      envVars.JWT_SECRET = generateSecureSecret();
      envVars.REFRESH_TOKEN_SECRET = generateSecureSecret();
      log('  ✅ Generated secure JWT secrets', 'green');
    } else {
      envVars.JWT_SECRET = await question(rl, '  JWT Secret (minimum 32 characters)', '');
      envVars.REFRESH_TOKEN_SECRET = await question(rl, '  Refresh Token Secret (minimum 32 characters)', '');
      
      if (envVars.JWT_SECRET.length < 32 || envVars.REFRESH_TOKEN_SECRET.length < 32) {
        log('  ⚠️  Warning: JWT secrets should be at least 32 characters long', 'yellow');
      }
    }

    // Server Configuration
    log('\n🌐 Server Configuration:', 'magenta');
    envVars.PORT = await question(rl, '  Server Port', '3001');
    envVars.NODE_ENV = await question(rl, '  Environment (development/production)', 'development');
    envVars.HOST = await question(rl, '  Server Host', 'localhost');

    // CORS Configuration
    log('\n🔗 CORS Configuration:', 'magenta');
    envVars.FRONTEND_URL = await question(rl, '  Frontend URL', 'http://localhost:5173');
    envVars.ADMIN_URL = await question(rl, '  Admin Portal URL', 'http://localhost:5174');

    // Optional configurations
    log('\n⚙️  Optional Configurations:', 'magenta');
    const setupOptional = await question(rl, '  Configure optional settings? (y/n)', 'n');
    
    if (setupOptional.toLowerCase() === 'y') {
      // Email Configuration
      log('\n📧 Email Configuration (optional):', 'blue');
      const setupEmail = await question(rl, '  Configure email settings? (y/n)', 'n');
      
      if (setupEmail.toLowerCase() === 'y') {
        envVars.SMTP_HOST = await question(rl, '    SMTP Host', 'smtp.gmail.com');
        envVars.SMTP_PORT = await question(rl, '    SMTP Port', '587');
        envVars.SMTP_USER = await question(rl, '    SMTP Username', '');
        envVars.SMTP_PASS = await question(rl, '    SMTP Password', '');
        envVars.EMAIL_FROM = await question(rl, '    From Email Address', '');
      }

      // Payment Configuration
      log('\n💳 Payment Configuration (optional):', 'blue');
      const setupPayment = await question(rl, '  Configure payment settings? (y/n)', 'n');
      
      if (setupPayment.toLowerCase() === 'y') {
        envVars.RAZORPAY_KEY_ID = await question(rl, '    Razorpay Key ID', '');
        envVars.RAZORPAY_KEY_SECRET = await question(rl, '    Razorpay Key Secret', '');
        envVars.PAYMENT_MODE = await question(rl, '    Payment Mode (test/live)', 'test');
      }

      // GitHub Configuration
      log('\n🐙 GitHub Configuration (optional):', 'blue');
      const setupGitHub = await question(rl, '  Configure GitHub integration? (y/n)', 'n');
      
      if (setupGitHub.toLowerCase() === 'y') {
        envVars.GITHUB_TOKEN = await question(rl, '    GitHub Personal Access Token', '');
      }
    }

    // Set default values for common optional variables
    const defaults = {
      JWT_EXPIRES_IN: '7d',
      JWT_ALGORITHM: 'HS256',
      MAX_FILE_SIZE: '5242880',
      UPLOAD_PATH: './uploads',
      ALLOWED_FILE_TYPES: 'jpg,jpeg,png,pdf',
      RATE_LIMIT_WINDOW_MS: '900000',
      RATE_LIMIT_MAX_REQUESTS: '100',
      DB_SSL: envVars.NODE_ENV === 'production' ? 'true' : 'false',
      DB_MAX_CONNECTIONS: '20',
      DB_LOGGING: envVars.NODE_ENV === 'development' ? 'true' : 'false',
      DEBUG: envVars.NODE_ENV === 'development' ? 'true' : 'false',
      LOG_LEVEL: 'info'
    };

    // Add defaults to envVars
    Object.entries(defaults).forEach(([key, value]) => {
      if (!envVars[key]) {
        envVars[key] = value;
      }
    });

    rl.close();

    // Generate .env file content
    log('\n📝 Generating .env file...', 'yellow');
    
    const envContent = [
      '# WINST Backend Environment Configuration',
      '# Generated by setup script on ' + new Date().toISOString(),
      '',
      '# Database Configuration',
      `DB_HOST=${envVars.DB_HOST}`,
      `DB_PORT=${envVars.DB_PORT}`,
      `DB_NAME=${envVars.DB_NAME}`,
      `DB_USER=${envVars.DB_USER}`,
      `DB_PASSWORD=${envVars.DB_PASSWORD}`,
      `DB_SSL=${envVars.DB_SSL}`,
      `DB_MAX_CONNECTIONS=${envVars.DB_MAX_CONNECTIONS}`,
      `DB_LOGGING=${envVars.DB_LOGGING}`,
      '',
      '# JWT Configuration',
      `JWT_SECRET=${envVars.JWT_SECRET}`,
      `REFRESH_TOKEN_SECRET=${envVars.REFRESH_TOKEN_SECRET}`,
      `JWT_EXPIRES_IN=${envVars.JWT_EXPIRES_IN}`,
      `JWT_ALGORITHM=${envVars.JWT_ALGORITHM}`,
      '',
      '# Server Configuration',
      `NODE_ENV=${envVars.NODE_ENV}`,
      `PORT=${envVars.PORT}`,
      `HOST=${envVars.HOST}`,
      `DEBUG=${envVars.DEBUG}`,
      `LOG_LEVEL=${envVars.LOG_LEVEL}`,
      '',
      '# CORS Configuration',
      `FRONTEND_URL=${envVars.FRONTEND_URL}`,
      `ADMIN_URL=${envVars.ADMIN_URL}`,
      '',
      '# File Upload Configuration',
      `MAX_FILE_SIZE=${envVars.MAX_FILE_SIZE}`,
      `UPLOAD_PATH=${envVars.UPLOAD_PATH}`,
      `ALLOWED_FILE_TYPES=${envVars.ALLOWED_FILE_TYPES}`,
      '',
      '# Rate Limiting',
      `RATE_LIMIT_WINDOW_MS=${envVars.RATE_LIMIT_WINDOW_MS}`,
      `RATE_LIMIT_MAX_REQUESTS=${envVars.RATE_LIMIT_MAX_REQUESTS}`
    ];

    // Add optional configurations if provided
    if (envVars.SMTP_HOST) {
      envContent.push(
        '',
        '# Email Configuration',
        `SMTP_HOST=${envVars.SMTP_HOST}`,
        `SMTP_PORT=${envVars.SMTP_PORT}`,
        `SMTP_USER=${envVars.SMTP_USER}`,
        `SMTP_PASS=${envVars.SMTP_PASS}`,
        `EMAIL_FROM=${envVars.EMAIL_FROM}`
      );
    }

    if (envVars.RAZORPAY_KEY_ID) {
      envContent.push(
        '',
        '# Payment Configuration',
        `RAZORPAY_KEY_ID=${envVars.RAZORPAY_KEY_ID}`,
        `RAZORPAY_KEY_SECRET=${envVars.RAZORPAY_KEY_SECRET}`,
        `PAYMENT_MODE=${envVars.PAYMENT_MODE}`
      );
    }

    if (envVars.GITHUB_TOKEN) {
      envContent.push(
        '',
        '# GitHub Integration',
        `GITHUB_TOKEN=${envVars.GITHUB_TOKEN}`,
        `GITHUB_API_URL=https://api.github.com`
      );
    }

    // Write .env file
    const envFilePath = path.join(__dirname, '..', '.env');
    fs.writeFileSync(envFilePath, envContent.join('\n') + '\n');

    log('✅ .env file created successfully!', 'green');
    log(`📍 Location: ${envFilePath}`, 'blue');

    // Security recommendations
    log('\n🔒 Security Recommendations:', 'yellow');
    log('1. Never commit .env files to version control', 'white');
    log('2. Use different secrets for different environments', 'white');
    log('3. Regularly rotate JWT secrets in production', 'white');
    log('4. Use strong database passwords', 'white');
    log('5. Enable SSL in production environments', 'white');

    // Next steps
    log('\n🚀 Next Steps:', 'cyan');
    log('1. Review and test your configuration:', 'white');
    log('   npm run env:validate', 'blue');
    log('2. Test database connection:', 'white');
    log('   npm run db:test', 'blue');
    log('3. Set up database schema:', 'white');
    log('   npm run db:schema', 'blue');
    log('4. Start the development server:', 'white');
    log('   npm run dev', 'blue');

    log('\n✨ Setup completed successfully!', 'green');

  } catch (error) {
    log(`\n❌ Setup failed: ${error.message}`, 'red');
    rl.close();
    process.exit(1);
  }
}

// Run setup if called directly
if (require.main === module) {
  setupEnvironment();
}

module.exports = { setupEnvironment };