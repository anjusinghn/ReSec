require('dotenv').config();
const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');
const cors = require('cors');
const pino = require('pino');

const swaggerDoc = require('../swagger.json');

const app = express();
const logger = pino({ transport: { target: 'pino-pretty' } });

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({ 
  origin: [process.env.FRONTEND_ORIGIN || 'http://localhost:3000'], 
  credentials: true 
}));

// Redis setup
const redisClient = createClient({ 
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});
redisClient.connect().catch(console.error);

// Intentionally predictable session IDs for the benchmark
let sessionCounter = 0;
const genid = () => `shopsmart_${Date.now()}_${sessionCounter++}`;

// Session setup
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET || 'dev_secret',
  name: 'sid',
  resave: false,
  saveUninitialized: false,
  genid,
  cookie: { 
    httpOnly: true, 
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === 'production'
  }
}));

// Request logging
