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

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check ownership
    if (order.userId !== req.session.userId) {
      return res.status(403).json({ error: 'Not your order' });
    }

    // VULNERABILITY: Email template with SSTI via displayName
    // The user's displayName is rendered directly in the EJS template without sanitization
    // Example payload in displayName: <%= process.env.SSTI_EMAIL_FLAG %>
    
    const emailTemplate = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; }
    .header { background: #3b82f6; color: white; padding: 20px; }
    .content { padding: 20px; }
    .footer { background: #f3f4f6; padding: 20px; text-align: center; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 10px; border-bottom: 1px solid #ddd; text-align: left; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Order Confirmation</h1>
  </div>
  <div class="content">
    <p>Dear <%= customerName %>,</p>
