import express from 'express';
import cors from 'cors';
import pkg from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import fs from 'fs';
import jobRoutes from './routes/jobRoutes.js';
import scrapeRoutes from './routes/scrapeRoutes.js';
import authRoutes from './routes/authRoutes.js';
import securityRoutes from './routes/securityRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import uploadRoutes from './routes/uploadRoutes.js';

const { json, urlencoded } = pkg;
const app = express();
app.set('trust proxy', 1);

const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Middleware
const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  }),
);
app.use(helmet());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

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
app.use('/api/auth', authRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/upload', uploadRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

export default app;
