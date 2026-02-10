import { config } from 'dotenv';
import app from './src/app.js';
import connectDB from './src/config/database.js';

// Load backend-local env file when running from backend/
config({ path: '.env' });
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', err => {
  console.error('❌ Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});
