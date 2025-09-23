#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

// Load env like server.js does
dotenv.config({ path: path.join(__dirname, '..', '.env') });
const envNode = process.env.NODE_ENV ? path.join(__dirname, '..', `.env.${process.env.NODE_ENV}`) : null;
if (envNode && fs.existsSync(envNode)) dotenv.config({ path: envNode, override: true });
const envLocal = path.join(__dirname, '..', '.env.local');
if (process.env.NODE_ENV !== 'production' && fs.existsSync(envLocal)) dotenv.config({ path: envLocal, override: true });

// Parse CLI args: --to=email@example.com
const args = process.argv.slice(2);
const toArg = args.find(a => a.startsWith('--to='));
const to = toArg ? toArg.split('=')[1] : process.env.SMTP_TEST_TO;

if (!to) {
  console.error('Missing --to=<email> (or set SMTP_TEST_TO in env).');
  process.exit(1);
}

const host = process.env.SMTP_HOST || 'smtp.gmail.com';
const port = parseInt(process.env.SMTP_PORT || '587', 10);
const secure = port === 465;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.SMTP_FROM || (user ? `Winst <${user}>` : 'Winst <no-reply@winst.com>');

(async () => {
  try {
    if (!host || !port || !user || !pass) {
      console.error('SMTP not fully configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS');
      process.exit(2);
    }
    console.log('Connecting to SMTP...', { host, port, secure, from, to });
    const transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
    const info = await transporter.sendMail({
      from,
      to,
      subject: 'Winst SMTP Test',
      text: 'This is a test email from Winst SMTP test script.',
      html: '<p>This is a <b>test email</b> from Winst SMTP test script.</p>'
    });
    console.log('Email sent. messageId:', info.messageId);
    process.exit(0);
  } catch (err) {
    console.error('SMTP test failed:', err && (err.code || err.name || err.message), '\
', err && err.message);
    if (err && err.response) console.error('Response:', err.response);
    process.exit(3);
  }
})();
