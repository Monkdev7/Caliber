import { Router } from 'express';
import { csrfProtection, csrfTokenHandler } from '../middleware/csrfProtection.js';

const router = Router();

router.get('/csrf', csrfProtection, csrfTokenHandler);

export default router;
