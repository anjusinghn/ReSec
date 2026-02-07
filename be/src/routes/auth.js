const express = require('express');
const bcrypt = require('bcrypt');
const prisma = require('../lib/db');

const router = express.Router();

// Register
router.post('/auth/register', async (req, res) => {
  try {
    const { username, email, password, displayName } = req.body;
    
    // Check if user exists
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    });
    
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await prisma.user.create({
