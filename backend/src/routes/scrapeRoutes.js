import { Router } from 'express';
const router = Router();
import scrapeController from '../controllers/scrapeController.js';

// POST /api/scrape/linkedin - Scrape LinkedIn
router.post(
  '/linkedin',
  scrapeController.scrapeLinkedIn.bind(scrapeController),
);

// POST /api/scrape/naukri - Scrape Naukri
router.post('/naukri', scrapeController.scrapeNaukri.bind(scrapeController));

// POST /api/scrape/unstop - Scrape Unstop
router.post('/unstop', scrapeController.scrapeUnstop.bind(scrapeController));

// POST /api/scrape/all - Scrape all sources
router.post('/all', scrapeController.scrapeAll.bind(scrapeController));

export default router;
