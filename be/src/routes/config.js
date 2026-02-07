const express = require('express');

const router = express.Router();

// Get config - INTENTIONALLY EXPOSES SENSITIVE DATA
router.get('/config', (req, res) => {
  try {
    // VULNERABILITY: Exposes all environment variables when specific header is present
    // The header check can be spoofed
    const adminHeader = req.headers['x-admin-key'];
    
    if (adminHeader === 'admin' || adminHeader === 'ADMIN') {
      // FLAG: Configuration leak vulnerability
      return res.json({
        database: process.env.DATABASE_URL,
        redis: process.env.REDIS_URL,
        session_secret: process.env.SESSION_SECRET,
        flag: 'PCTFS{configuration_data_exposed}',
        admin_credentials: {
          email: process.env.ADMIN_EMAIL,
