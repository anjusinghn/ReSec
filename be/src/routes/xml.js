const express = require('express');
const { XMLParser } = require('fast-xml-parser');
const fs = require('fs');

const router = express.Router();

// XML product import - INTENTIONALLY VULNERABLE TO XXE (simulated)
router.post('/admin/import', async (req, res) => {
  try {
    // Weak auth bypass - just checking for any admin header
    const adminHeader = req.headers['x-admin'] || req.headers['x-admin-key'];
    
    if (!adminHeader) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const { xml } = req.body;
    
    if (!xml) {
      return res.status(400).json({ error: 'XML data required' });
    }
    
    // VULNERABILITY: Simulated XXE - detect entity references in XML
    // Since fast-xml-parser doesn't support XXE naturally, we simulate it
    // by detecting entity references and resolving them manually
    // Real XXE payload: <!DOCTYPE data [<!ENTITY xxe SYSTEM "file:///app/secrets/flag.txt">]>
    
    try {
      // Check if XML contains entity definition
