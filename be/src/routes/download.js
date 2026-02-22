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
    let processedFile = file.replace(/\.\.\.\.\/\//g, '../');
    
    // Also vulnerable to direct absolute paths
    let finalPath;
    if (processedFile.startsWith('/')) {
      finalPath = processedFile;
    } else {
      const baseDir = '/app/invoices';
      finalPath = path.join(baseDir, processedFile);
    }
    
    // VULNERABILITY: No proper path validation
    try {
      const fileContent = fs.readFileSync(finalPath, 'utf8');
      
      // Successful path traversal - return file content with flag
      return res.send(fileContent + '\nPCTFS{path_traversal_invoice_download_bypass}');
    } catch (err) {
      res.status(404).json({ 
        error: 'File not found'
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Profile picture upload - INTENTIONALLY VULNERABLE TO PATH TRAVERSAL  
router.post('/upload/profile-picture', async (req, res) => {
  try {
    if (!req.session.userId) {
