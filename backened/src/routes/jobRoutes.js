// src/routes/jobRoutes.js
const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

// GET /api/jobs - Get all jobs with filters
router.get('/', jobController.getJobs.bind(jobController));

// GET /api/jobs/stats - Get statistics
router.get('/stats', jobController.getStats.bind(jobController));

// GET /api/jobs/:id - Get single job
router.get('/:id', jobController.getJobById.bind(jobController));

// DELETE /api/jobs/old - Delete old jobs
router.delete('/old', jobController.deleteOldJobs.bind(jobController));

module.exports = router;