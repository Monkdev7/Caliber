import express from 'express';
import cors from 'cors';
import multer from 'multer';
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

// Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDFs are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

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

app.post('/api/upload', upload.single('pdfFile'), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ message: 'No file uploaded or invalid format' });
  }
  res.json({
    message: 'File saved successfully',
    filename: req.file.filename,
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
