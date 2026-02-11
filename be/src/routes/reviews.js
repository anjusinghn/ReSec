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
