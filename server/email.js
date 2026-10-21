import nodemailer from 'nodemailer';

const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

const DEFAULT_SENDER = {
  name: process.env.SENDER_NAME || 'Portfolio',
  email: process.env.SENDER_EMAIL || 'noreply@example.com',
};

export const CONTACT_RECIPIENT = process.env.CONTACT_RECIPIENT || 'contact@example.com';

let transporter;

export async function sendEmail({ to, replyTo, subject, text, html }) {
  if (!process.env.SMTP_HOST) {
    throw new Error('SMTP is not configured (set SMTP_HOST, SMTP_USER, SMTP_PASS in .env)');
  }
  transporter ??= nodemailer.createTransport(EMAIL_CONFIG);
  return transporter.sendMail({
    from: `"${DEFAULT_SENDER.name}" <${DEFAULT_SENDER.email}>`,
    to,
    replyTo,
    subject,
    text,
    html,
  });
}
