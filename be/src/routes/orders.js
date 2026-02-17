const express = require('express');
const { Pool } = require('pg');
const prisma = require('../lib/db');

const router = express.Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Get user orders
router.get('/orders', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const orders = await prisma.order.findMany({
      where: { userId: req.session.userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
