const express = require('express');
const prisma = require('../lib/db');

const router = express.Router();

// Admin dashboard
router.get('/admin/dashboard', async (req, res) => {
  try {
    if (req.session.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const stats = {
      totalUsers: await prisma.user.count(),
      totalOrders: await prisma.order.count(),
      totalProducts: await prisma.product.count(),
      totalReviews: await prisma.review.count()
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin API index
router.get('/admin', (req, res) => {
  res.json({
    service: 'Hackazon Admin API',
    description: 'Administrative endpoints for catalog management and debug tooling.',
    endpoints: [
      {
