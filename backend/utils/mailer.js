const nodemailer = require('nodemailer');

// Singleton transporter
let transporter;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = port === 465; // true for 465
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    console.warn('SMTP not fully configured. Emails will be skipped.');
    return null;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  return transporter;
}

async function sendMail({ to, subject, text, html, from }) {
  const t = getTransporter();
  if (!t) {
    console.warn('Email not sent: SMTP is not configured. Set SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS. Target:', { to, subject });
    return { skipped: true };
  }
  const defaultFrom = process.env.SMTP_FROM || (process.env.SMTP_USER ? `Winst <${process.env.SMTP_USER}>` : 'Winst <no-reply@winst.com>');

  try {
    const info = await t.sendMail({
      from: from || defaultFrom,
      to,
      subject,
      text,
      html,
    });

    return { messageId: info.messageId };
  } catch (err) {
    console.error('Email transport failed:', err?.code || err?.name || 'Error', err?.message);
    throw err;
  }
}

function isSmtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS);
}

module.exports = { getTransporter, sendMail, isSmtpConfigured };
