import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';

const getAccessSecret = () => {
    if (!process.env.JWT_ACCESS_SECRET) {
        throw new AppError('JWT access secret is missing', 500);
    }
    return process.env.JWT_ACCESS_SECRET;
};

const requireAuth = (req, res, next) => {
    try {
        const token = req.cookies?.access_token;
        if (!token) {
            throw new AppError('Authentication required', 401);
        }

        const payload = jwt.verify(token, getAccessSecret());
        req.user = { id: payload.sub, email: payload.email };
        next();
    } catch (error) {
        next(error);
    }
};

export default requireAuth;
