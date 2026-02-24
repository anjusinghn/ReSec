const express = require('express');
const prisma = require('../lib/db');

const router = express.Router();

// Get reviews for a product
router.get('/reviews/:productId', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: parseInt(req.params.productId) },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create review - STORES XSS PAYLOAD
router.post('/reviews', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const { productId, rating, text } = req.body;

    const parsedProductId = parseInt(productId);
    if (Number.isNaN(parsedProductId)) {
      return res.status(400).json({ error: 'Invalid productId' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.session.userId },
      select: { id: true, username: true, displayName: true }
    });

    const xssPattern = /<\s*(script|img|svg|iframe)|on\w+=|javascript:|alert\s*\(/i;
    const xssDetected = typeof text === 'string' && xssPattern.test(text);
    const flagValue = process.env.XSS_STORED_FLAG || 'PCTFS{stored_xss_alert_flag}';

