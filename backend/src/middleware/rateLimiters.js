import rateLimit from 'express-rate-limit';

const defaultWindowMs = parseInt(
    process.env.RATE_LIMIT_WINDOW_MS || String(15 * 60 * 1000),
    10,
);

export const authLimiter = rateLimit({
    windowMs: defaultWindowMs,
    max: parseInt(process.env.RATE_LIMIT_MAX || '20', 10),
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests. Please try again soon.',
    },
});

export const passwordResetLimiter = rateLimit({
    windowMs: defaultWindowMs,
    max: parseInt(process.env.RATE_LIMIT_RESET_MAX || '5', 10),
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many reset attempts. Please try again later.',
    },
});

export const refreshLimiter = rateLimit({
    windowMs: defaultWindowMs,
    max: parseInt(process.env.RATE_LIMIT_REFRESH_MAX || '60', 10),
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many refresh requests. Please try again later.',
    },
});
