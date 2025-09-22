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
  console.log("user", user, pass);

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
    console.log('sendMail skipped (no SMTP config):', { to, subject });
    return { skipped: true };
  }
  const defaultFrom = process.env.SMTP_FROM || (process.env.SMTP_USER ? `Winst <${process.env.SMTP_USER}>` : 'Winst <no-reply@winst.com>');

  const info = await t.sendMail({
    from: from || defaultFrom,
    to,
    subject,
    text,
    html,
  });

  return { messageId: info.messageId };
}

module.exports = { getTransporter, sendMail };
