// src/routes/scrapeRoutes.js
const express = require('express');
const router = express.Router();
const scrapeController = require('../controllers/scrapeController');

// POST /api/scrape/linkedin - Scrape LinkedIn
router.post('/linkedin', scrapeController.scrapeLinkedIn.bind(scrapeController));

// POST /api/scrape/naukri - Scrape Naukri
router.post('/naukri', scrapeController.scrapeNaukri.bind(scrapeController));

// POST /api/scrape/all - Scrape all sources
router.post('/all', scrapeController.scrapeAll.bind(scrapeController));

module.exports = router;