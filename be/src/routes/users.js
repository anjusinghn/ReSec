const express = require('express');
const prisma = require('../lib/db');

const router = express.Router();

// Get user profile - INTENTIONALLY VULNERABLE TO IDOR
router.get('/user/:userId', async (req, res) => {
  try {
    // VULNERABILITY: No authorization check - any user can view any profile
    const userId = parseInt(req.params.userId);
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        role: true,
        secretNote: true, // FLAG: Admin user has flag in secretNote
        createdAt: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
