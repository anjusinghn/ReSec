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
