const express = require('express');
const https = require('https');
const http = require('http');

const router = express.Router();

// Webhook verification - INTENTIONALLY VULNERABLE TO SSRF
router.post('/settings/webhook', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'Webhook URL required' });
    }
    
    // VULNERABILITY: No validation of URL - allows scanning internal network
    // Can be used to reach:
    // - http://internal-api:5000/secret
    // - http://localhost:5000/secret  
    // - http://169.254.169.254/latest/meta-data/ (cloud metadata)
    
    const urlObj = new URL(url);
    const proto = urlObj.protocol === 'https:' ? https : http;
    
    proto.get(url, (webhookRes) => {
      let data = '';
      
      webhookRes.on('data', (chunk) => {
        data += chunk;
      });
      
      webhookRes.on('end', () => {
        res.json({
          message: 'Webhook verified successfully',
          statusCode: webhookRes.statusCode,
          response: data,
