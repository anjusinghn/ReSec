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
