const express = require('express');
const { Pool } = require('pg');
const prisma = require('../lib/db');

const router = express.Router();

// Create PostgreSQL pool for raw SQL queries (intentionally vulnerable)
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Get all products (safe)
router.get('/products', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    
    const products = await prisma.product.findMany({
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' }
    });
    
    const total = await prisma.product.count();
    
    res.json({
      items: products,
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search products - INTENTIONALLY VULNERABLE TO SQL INJECTION
router.get('/products/search', async (req, res) => {
  try {
    const { q = '', category = '' } = req.query;
    
    // VULNERABILITY: SQL injection via string concatenation
    const conditions = [];
    
    if (q) {
      // This allows SQL injection through the search query
      conditions.push(`name ILIKE '%${q}%'`);
    }
    
    if (category) {
      // This allows SQL injection through category parameter
      // Example payload: ?category=1 OR 1=1 UNION SELECT * FROM admin_secret
      conditions.push(`category_id = ${category}`);
    }
    
    const whereClause = conditions.length > 0 
