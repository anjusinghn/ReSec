const express = require('express');
const prisma = require('../lib/db');

const router = express.Router();

// Get user wishlist
router.get('/wishlist', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const items = await prisma.wishlistItem.findMany({
      where: { userId: req.session.userId },
      include: {
        product: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add to wishlist
router.post('/wishlist', async (req, res) => {
  try {
    if (!req.session.userId) {
