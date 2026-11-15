const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const config = require('./config/env');
const { generalLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const hackathonRoutes = require('./routes/hackathonRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

// Trust reverse proxy for rate-limiting on Render, Railway, Heroku, etc.
app.set('trust proxy', 1);

// Security headers with helmet configured for production
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
        connectSrc: ["'self'", config.clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// Cookie Parser Middleware for HttpOnly JWT cookies
app.use(cookieParser());

// Tight CORS configuration with credentials support
const clientUrls = (process.env.CLIENT_URL || config.clientUrl || '')
  .split(',')
  .map((u) => u.trim())
  .filter(Boolean);

const localhostOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. server-to-server, curl, tests, mobile)
      if (!origin) return callback(null, true);

      // Check configured client URLs
      if (clientUrls.includes(origin)) {
        return callback(null, true);
      }

      // Allow localhost origins ONLY when NODE_ENV !== 'production'
      if (config.nodeEnv !== 'production' && localhostOrigins.includes(origin)) {
        return callback(null, true);
      }

      const corsError = new Error(`CORS policy violation: origin ${origin} is not permitted.`);
      corsError.status = 403;
      return callback(corsError);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Body parsers
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Logging with morgan (only in non-test mode)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Global general rate limiter
app.use('/api', generalLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MatruCare AI Hackathon 2026 API is operational',
    timestamp: new Date().toISOString(),
    env: config.nodeEnv,
  });
});

// Mount modular API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/hackathon', hackathonRoutes);
app.use('/api/contact', contactRoutes);

// Catch 404 and forward to error handler
app.use(notFound);

// Centralized error handling middleware
app.use(errorHandler);

module.exports = app;
