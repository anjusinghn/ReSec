'use client';

import { useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export default function InvoiceParserPage() {
  const [xmlData, setXmlData] = useState(`<invoices>
  <invoice id="INV-001">
    <customer>John Doe</customer>
    <amount>299.99</amount>
    <date>2025-01-15</date>
    <items>
      <item>Wireless Headphones</item>
      <item>Phone Case</item>
    </items>
  </invoice>
</invoices>`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleParse = async (e) => {
    e.preventDefault();
    if (!xmlData.trim()) {
      setError('Please enter XML invoice data to parse');
      return;
    }

    setLoading(true);
    setError('');
