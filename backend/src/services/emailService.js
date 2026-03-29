import nodemailer from 'nodemailer';
import AppError from '../utils/appError.js';

const smtpConfigured = () =>
    Boolean(
        process.env.SMTP_HOST &&
        process.env.SMTP_PORT &&
        process.env.SMTP_USER &&
        process.env.SMTP_PASS,
    );

export const isEmailServiceConfigured = () => smtpConfigured();

export const getEmailServiceStatus = () => ({
    configured: smtpConfigured(),
    host: process.env.SMTP_HOST || null,
    port: process.env.SMTP_PORT || null,
    secure: process.env.SMTP_SECURE === 'true',
    fromEmail: process.env.SMTP_FROM_EMAIL || null,
});

const createTransporter = () => {
    if (!smtpConfigured()) return null;

    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

const getFromAddress = () => {
    const fromName = process.env.SMTP_FROM_NAME || 'Caliber';
    const fromEmail = process.env.SMTP_FROM_EMAIL || 'no-reply@caliber.local';
    return `"${fromName}" <${fromEmail}>`;
};

const getResetUrl = token => {
    const frontendBase = process.env.FRONTEND_URL || 'http://localhost:5173';
    return `${frontendBase.replace(/\/$/, '')}/reset-password?token=${encodeURIComponent(token)}`;
};

export const sendWelcomeEmail = async () => undefined;

export const sendResetEmail = async ({ to, token }) => {
    const resetUrl = getResetUrl(token);
    const transporter = createTransporter();

    if (!transporter) {
        console.info(`Password reset link for ${to}: ${resetUrl}`);
        return { delivered: false, resetUrl };
    }

    await transporter.sendMail({
        from: getFromAddress(),
        to,
        subject: 'Reset your Caliber password',
        text: `You requested a password reset. Open this link to continue: ${resetUrl}\n\nIf you did not request this, you can ignore this email.`,
        html: `<p>You requested a password reset.</p><p><a href="${resetUrl}">Reset your password</a></p><p>If you did not request this, you can ignore this email.</p>`,
    });

    return { delivered: true, resetUrl };
};

export const sendTestEmail = async ({ to }) => {
    const transporter = createTransporter();
    if (!transporter) {
        throw new AppError('SMTP is not configured for sending emails.', 503);
    }

    await transporter.sendMail({
        from: getFromAddress(),
        to,
        subject: 'Caliber SMTP test email',
        text: 'This is a test email from Caliber. Your SMTP configuration is working.',
        html: '<p>This is a test email from <strong>Caliber</strong>.</p><p>Your SMTP configuration is working.</p>',
    });

    return { delivered: true, to };
};
