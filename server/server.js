// server/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { analyzeVideo } from './controllers/analyzeController.js';

dotenv.config();

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false, // Disable CSP for API
}));

// CORS configuration for production - handle preflight requests
app.use((req, res, next) => {
  // Allow all origins in development, specific origins in production
  const allowedOrigins = process.env.NODE_ENV === 'production'
    ? ['https://ai-youtube-sentiment-bot.vercel.app', 'https://youtube-sentiment-bot.vercel.app']
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5000'];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
    res.header('Access-Control-Allow-Origin', origin || '*');
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Debug logging for CORS issues
  if (process.env.NODE_ENV === 'development') {
    console.log('CORS Debug:', {
      origin: req.headers.origin,
      method: req.method,
      allowed: allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production'
    });
  }

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }

  next();
});

// Alternative CORS setup (uncomment if above doesn't work)
// app.use(cors({
//   origin: function (origin, callback) {
//     const allowedOrigins = process.env.NODE_ENV === 'production'
//       ? ['https://ai-youtube-sentiment-bot.vercel.app', 'https://youtube-sentiment-bot.vercel.app']
//       : true; // Allow all in development
//
//     if (!origin || allowedOrigins === true || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));

// Routes
app.post('/api/analyze', analyzeVideo);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    cors: 'enabled'
  });
});

// CORS test endpoint
app.get('/api/test-cors', (req, res) => {
  res.json({
    message: 'CORS is working!',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

// For Vercel serverless functions
if (process.env.VERCEL) {
  module.exports = app;
} else {
  // For local development
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
      console.log('Process terminated');
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
      console.log('Process terminated');
    });
  });
}
