import express from 'express';
import cors from 'cors';
import pkg from 'body-parser';
import jobRoutes from './routes/jobRoutes.js';
import scrapeRoutes from './routes/scrapeRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const { json, urlencoded } = pkg;
const app = express();

// Middleware
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/scrape', scrapeRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

export default app;
