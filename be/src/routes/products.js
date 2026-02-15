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
