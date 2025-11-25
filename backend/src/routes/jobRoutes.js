import { Router } from 'express';
const router = Router();
import jobController from '../controllers/jobController.js';

// GET /api/jobs - Get all jobs with filters
router.get('/', jobController.getJobs.bind(jobController));

// GET /api/jobs/stats - Get statistics
router.get('/stats', jobController.getStats.bind(jobController));

// GET /api/jobs/:id - Get single job
router.get('/:id', jobController.getJobById.bind(jobController));

// DELETE /api/jobs/old - Delete old jobs
router.delete('/old', jobController.deleteOldJobs.bind(jobController));

export default router;
