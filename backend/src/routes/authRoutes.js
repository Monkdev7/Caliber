import { Router } from 'express';
import authController from '../controllers/authController.js';
import requireAuth from '../middleware/requireAuth.js';
import {
    authLimiter,
    passwordResetLimiter,
    refreshLimiter,
} from '../middleware/rateLimiters.js';
import { csrfProtection } from '../middleware/csrfProtection.js';

const router = Router();

router.post(
    '/signup',
    csrfProtection,
    authLimiter,
    authController.signup.bind(authController),
);
router.post(
    '/login',
    csrfProtection,
    authLimiter,
    authController.login.bind(authController),
);
router.post(
    '/forgot-password',
    csrfProtection,
    passwordResetLimiter,
    authController.forgotPassword.bind(authController),
);
router.post(
    '/reset-password',
    csrfProtection,
    passwordResetLimiter,
    authController.resetPassword.bind(authController),
);
router.post(
    '/refresh',
    csrfProtection,
    refreshLimiter,
    authController.refresh.bind(authController),
);
router.post(
    '/logout',
    csrfProtection,
    authLimiter,
    authController.logout.bind(authController),
);

router.get('/me', requireAuth, authController.me.bind(authController));

export default router;
