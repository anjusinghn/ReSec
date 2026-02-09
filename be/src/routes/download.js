const express = require('express');
const path = require('path');
const fs = require('fs');
const prisma = require('../lib/db');

const AFFILIATE_FLAG = process.env.AFFILIATE_FLAG || 'PCTFS{pctfs_vip_coupon:R3S3CURITY143}';

const router = express.Router();

// Invoice download - INTENTIONALLY VULNERABLE TO PATH TRAVERSAL
router.get('/download/invoice', async (req, res) => {
  try {
    const { file } = req.query;
    
    if (!file) {
      return res.status(400).json({ 
        error: 'File parameter required'
      });
    }
    
    // VULNERABILITY 1: Path traversal through file parameter
    // Weak validation can be bypassed with ....// technique
    
    // Weak validation - blocks simple ../ but not ....//
    if (file.includes('..') && !file.includes('....//')) {
      return res.status(400).json({ 
        error: 'Invalid file path detected'
      });
    }
    
    // VULNERABILITY: ....// bypass works by replacing with ../ after check
