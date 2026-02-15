const express = require('express');
const https = require('https');
const http = require('http');

const router = express.Router();

// Image proxy - INTENTIONALLY VULNERABLE TO SSRF
router.get('/proxy', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter required' });
    }
    
    // VULNERABILITY 1: Case-sensitive file:// scheme check can be bypassed with File://
    if (url.toLowerCase().startsWith('file://')) {
      return res.status(400).json({ error: 'File URLs not allowed' });
    }
