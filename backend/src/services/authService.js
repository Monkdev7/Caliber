import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import AppError from '../utils/appError.js';
import { getPasswordIssues, isValidEmail } from '../utils/validators.js';

const getAccessSecret = () => {
    if (!process.env.JWT_ACCESS_SECRET) {
        throw new AppError('JWT access secret is missing', 500);
    }
    return process.env.JWT_ACCESS_SECRET;
};

const getAccessExpiresIn = () => process.env.JWT_ACCESS_EXPIRES || '15m';

const getRefreshExpiryDays = () =>
    parseInt(process.env.REFRESH_TOKEN_EXPIRES_DAYS || '7', 10);

const hashToken = token =>
    crypto.createHash('sha256').update(token).digest('hex');

const generateRefreshToken = () => crypto.randomBytes(64).toString('hex');

const generateAccessToken = user =>
    jwt.sign(
        { sub: user._id.toString(), email: user.email },
        getAccessSecret(),
        { expiresIn: getAccessExpiresIn() },
    );

class AuthService {
    async getUserById(userId) {
        if (!userId) {
            throw new AppError('Authentication required', 401);
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        return user;
    }

    async signup({ fullName, email, password }) {
        if (!fullName || !email || !password) {
            throw new AppError('Full name, email, and password are required', 400);
        }

        if (!isValidEmail(email)) {
            throw new AppError('Please provide a valid email address', 400);
        }

        const passwordIssues = getPasswordIssues(password);
        if (passwordIssues.length) {
            throw new AppError(
                `Password must include ${passwordIssues.join(', ')}`,
                400,
            );
        }

        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            throw new AppError('An account with this email already exists', 409);
        }

        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const user = await User.create({
            fullName,
            email: email.toLowerCase(),
            passwordHash,
        });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken();
        const refreshTokenHash = hashToken(refreshToken);
        const refreshTokenExpiresAt = new Date();
        refreshTokenExpiresAt.setDate(
            refreshTokenExpiresAt.getDate() + getRefreshExpiryDays(),
        );

        user.refreshTokenHash = refreshTokenHash;
        user.refreshTokenExpiresAt = refreshTokenExpiresAt;
        await user.save();

        return { user, accessToken, refreshToken };
    }

    async login({ email, password }) {
        if (!email || !password) {
            throw new AppError('Email and password are required', 400);
        }

        const user = await User.findOne({ email: email.toLowerCase() }).select(
            '+passwordHash +refreshTokenHash +refreshTokenExpiresAt',
        );

        if (!user) {
            throw new AppError('Invalid credentials', 401);
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new AppError('Invalid credentials', 401);
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken();
        const refreshTokenHash = hashToken(refreshToken);
        const refreshTokenExpiresAt = new Date();
        refreshTokenExpiresAt.setDate(
            refreshTokenExpiresAt.getDate() + getRefreshExpiryDays(),
        );

        user.refreshTokenHash = refreshTokenHash;
        user.refreshTokenExpiresAt = refreshTokenExpiresAt;
        await user.save();

        return { user, accessToken, refreshToken };
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw new AppError('Refresh token is missing', 401);
        }

        const refreshTokenHash = hashToken(refreshToken);

        const user = await User.findOne({
            refreshTokenHash,
            refreshTokenExpiresAt: { $gt: new Date() },
        }).select('+refreshTokenHash +refreshTokenExpiresAt');

        if (!user) {
            throw new AppError('Session expired. Please log in again.', 401);
        }

        const accessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken();
        const newRefreshTokenHash = hashToken(newRefreshToken);
        const refreshTokenExpiresAt = new Date();
        refreshTokenExpiresAt.setDate(
            refreshTokenExpiresAt.getDate() + getRefreshExpiryDays(),
        );

        user.refreshTokenHash = newRefreshTokenHash;
        user.refreshTokenExpiresAt = refreshTokenExpiresAt;
        await user.save();

        return { user, accessToken, refreshToken: newRefreshToken };
    }

    async logout(refreshToken) {
        if (!refreshToken) return;

        const refreshTokenHash = hashToken(refreshToken);
        await User.updateOne(
            { refreshTokenHash },
            { $unset: { refreshTokenHash: '', refreshTokenExpiresAt: '' } },
        );
    }

    async createResetToken(email) {
        if (!email) {
            throw new AppError('Email is required', 400);
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return null;
        }

        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = hashToken(rawToken);

        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15);

        user.passwordResetTokenHash = hashedToken;
        user.passwordResetExpiresAt = expiresAt;
        await user.save();

        return { user, rawToken };
    }

    async resetPassword({ token, password }) {
        if (!token || !password) {
            throw new AppError('Reset token and new password are required', 400);
        }

        const normalizedToken = String(token).trim();
        if (!normalizedToken) {
            throw new AppError('Reset token and new password are required', 400);
        }

        const passwordIssues = getPasswordIssues(password);
        if (passwordIssues.length) {
            throw new AppError(
                `Password must include ${passwordIssues.join(', ')}`,
                400,
            );
        }

        const hashedToken = hashToken(normalizedToken);

        const user = await User.findOne({
            passwordResetTokenHash: hashedToken,
            passwordResetExpiresAt: { $gt: new Date() },
        }).select('+passwordHash');

        if (!user) {
            throw new AppError('Reset token is invalid or expired', 400);
        }

        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);
        user.passwordHash = await bcrypt.hash(password, saltRounds);
        user.passwordResetTokenHash = undefined;
        user.passwordResetExpiresAt = undefined;
        user.refreshTokenHash = undefined;
        user.refreshTokenExpiresAt = undefined;
        await user.save();

        return user;
    }
}

export default new AuthService();
