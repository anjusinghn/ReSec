const express = require('express');
const ejs = require('ejs');
const nodemailer = require('nodemailer');
const prisma = require('../lib/db');

const router = express.Router();

// Create email transporter (for demo - won't actually send)
const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 1025, // MailHog for local testing
  ignoreTLS: true
});

// Send order confirmation email - INTENTIONALLY VULNERABLE TO SSTI
router.post('/orders/:id/send-confirmation', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        user: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });

