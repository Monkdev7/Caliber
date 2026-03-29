import { Router } from 'express';
import { csrfProtection, csrfTokenHandler } from '../middleware/csrfProtection.js';
import requireAuth from '../middleware/requireAuth.js';
import { authLimiter } from '../middleware/rateLimiters.js';
import {
    getEmailServiceStatus,
    sendTestEmail,
} from '../services/emailService.js';

const router = Router();

router.get('/csrf', csrfProtection, csrfTokenHandler);

router.get('/email/status', (req, res) => {
    const status = getEmailServiceStatus();
    res.status(200).json({
        success: true,
        data: status,
    });
});

router.post(
    '/email/test',
    csrfProtection,
    requireAuth,
    authLimiter,
    async (req, res, next) => {
        try {
            const to = req.user?.email;
            const result = await sendTestEmail({ to });

            res.status(200).json({
                success: true,
                message: `Test email sent to ${to}`,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
);

export default router;
