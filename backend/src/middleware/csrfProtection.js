import csrf from 'csurf';
import { setCsrfTokenCookie } from '../utils/csrf.js';

const csrfMiddleware = csrf({ cookie: true });

export const csrfProtection = (req, res, next) => {
    if (process.env.ENABLE_CSRF === 'false') {
        return next();
    }

    return csrfMiddleware(req, res, next);
};

export const csrfTokenHandler = (req, res) => {
    if (process.env.ENABLE_CSRF === 'false') {
        return res.status(200).json({ success: true, csrfToken: null });
    }

    const token = req.csrfToken();
    setCsrfTokenCookie(res, token);
    res.status(200).json({ success: true, csrfToken: token });
};
