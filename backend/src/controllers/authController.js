import authService from '../services/authService.js';
import { setAuthCookies, clearAuthCookies } from '../utils/cookies.js';

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

    async forgotPassword(req, res) {
        res.status(503).json({
            success: false,
            message:
                'Password reset emails are temporarily disabled. Please try again later.',
        });
    }

    async resetPassword(req, res) {
        clearAuthCookies(res);

        res.status(503).json({
            success: false,
            message:
                'Password reset is temporarily disabled. Please try again later.',
        });
    }
}

export default new AuthController();
