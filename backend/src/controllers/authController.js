import authService from '../services/authService.js';
import {
    sendResetEmail,
    isEmailServiceConfigured,
} from '../services/emailService.js';
import { setAuthCookies, clearAuthCookies } from '../utils/cookies.js';
import AppError from '../utils/appError.js';

class AuthController {
    async signup(req, res, next) {
        try {
            const { fullName, email, password } = req.body;
            const { user, accessToken, refreshToken } = await authService.signup({
                fullName,
                email,
                password,
            });

            setAuthCookies(res, accessToken, refreshToken);

            res.status(201).json({
                success: true,
                message: 'Signup successful',
                data: {
                    user: {
                        id: user._id,
                        fullName: user.fullName,
                        email: user.email,
                    },
                },
            });
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const { user, accessToken, refreshToken } = await authService.login({
                email,
                password,
            });

            setAuthCookies(res, accessToken, refreshToken);

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    user: {
                        id: user._id,
                        fullName: user.fullName,
                        email: user.email,
                    },
                },
            });
        } catch (error) {
            next(error);
        }
    }

    async refresh(req, res, next) {
        try {
            const refreshToken = req.cookies?.refresh_token;
            const { user, accessToken, refreshToken: newRefreshToken } =
                await authService.refresh(refreshToken);

            setAuthCookies(res, accessToken, newRefreshToken);

            res.status(200).json({
                success: true,
                message: 'Session refreshed',
                data: {
                    user: {
                        id: user._id,
                        fullName: user.fullName,
                        email: user.email,
                    },
                },
            });
        } catch (error) {
            next(error);
        }
    }

    async logout(req, res, next) {
        try {
            const refreshToken = req.cookies?.refresh_token;
            await authService.logout(refreshToken);

            clearAuthCookies(res);

            res.status(200).json({
                success: true,
                message: 'Logged out successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    async me(req, res, next) {
        try {
            const user = await authService.getUserById(req.user?.id);

            res.status(200).json({
                success: true,
                message: 'Authenticated',
                data: {
                    user: {
                        id: user._id,
                        fullName: user.fullName,
                        email: user.email,
                    },
                },
            });
        } catch (error) {
            next(error);
        }
    }

    async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            const devLinkEnabled = process.env.ENABLE_DEV_RESET_LINK === 'true';
            const emailConfigured = isEmailServiceConfigured();

            if (!emailConfigured && !devLinkEnabled) {
                throw new AppError(
                    'Password reset email is not configured on this server.',
                    503,
                );
            }

            const resetData = await authService.createResetToken(email);
            let emailResult = null;
            if (resetData) {
                emailResult = await sendResetEmail({
                    to: resetData.user.email,
                    token: resetData.rawToken,
                });
            }

            const includeResetUrl = devLinkEnabled && Boolean(emailResult?.resetUrl);

            res.status(200).json({
                success: true,
                message:
                    'If an account exists for that email, a password reset link has been sent.',
                ...(includeResetUrl
                    ? {
                        data: {
                            resetUrl: emailResult.resetUrl,
                            delivered: Boolean(emailResult.delivered),
                        },
                    }
                    : {}),
            });
        } catch (error) {
            next(error);
        }
    }

    async resetPassword(req, res, next) {
        try {
            const { token, password } = req.body;
            await authService.resetPassword({ token, password });

            clearAuthCookies(res);

            res.status(200).json({
                success: true,
                message:
                    'Password updated successfully. Please sign in with your new password.',
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController();
