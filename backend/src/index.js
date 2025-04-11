const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const marketRoutes = require('./routes/marketRoutes');
const tradeRoutes = require('./routes/tradeRoutes');
const backtestRoutes = require('./routes/backtest.ts');
const performanceRoutes = require('./routes/performance.js');
const strategiesRoutes = require('./routes/strategies.js');
const cookieParser = require('cookie-parser');
const { setupWebSocket } = require('./websocket');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Enable CORS with proper settings
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? [
            'https://ai-trading-lac.vercel.app',
            'https://ai-trading-lac.vercel.app/',
          ]
        : 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    exposedHeaders: ['Set-Cookie'],
  })
);

// Parse cookies
app.use(cookieParser());

// Parse JSON bodies
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/backtest', backtestRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/strategies', strategiesRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
  });
});

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Setup WebSocket server
setupWebSocket(server);
