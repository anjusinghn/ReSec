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
    setResult(null);

    try {
      const response = await fetch(`${API_BASE}/api/v1/invoice/parse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ xml: xmlData })
      });

      const data = await response.json();
      setResult({
        status: response.status,
        data: data
      });

      if (!response.ok) {
        setError(data.error || 'Parsing failed');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadSampleInvoice = (type) => {
    const samples = {
      single: `<invoices>
  <invoice id="INV-001">
    <customer>Alice Smith</customer>
    <amount>149.99</amount>
    <date>2025-01-15</date>
    <items>
      <item>Coffee Maker</item>
    </items>
  </invoice>
</invoices>`,
      multiple: `<invoices>
  <invoice id="INV-002">
    <customer>Bob Johnson</customer>
    <amount>89.50</amount>
    <date>2025-01-14</date>
    <items>
      <item>Book</item>
      <item>Notebook</item>
    </items>
  </invoice>
  <invoice id="INV-003">
    <customer>Carol White</customer>
    <amount>299.99</amount>
    <date>2025-01-13</date>
    <items>
      <item>Tablet</item>
    </items>
  </invoice>
</invoices>`,
      detailed: `<invoices>
  <invoice id="INV-004">
    <customer>David Brown</customer>
    <email>david@example.com</email>
    <amount>459.99</amount>
    <tax>36.80</tax>
    <total>496.79</total>
    <date>2025-01-12</date>
    <billing_address>
      <street>123 Main St</street>
      <city>New York</city>
      <zip>10001</zip>
    </billing_address>
    <items>
      <item quantity="1" price="459.99">Gaming Monitor</item>
    </items>
  </invoice>
</invoices>`
    };
    setXmlData(samples[type]);
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Invoice Parser Tool</h1>
          <p className="text-foreground/70 mt-2">
            Parse and validate XML invoice data. This tool helps process invoice files from various sources and formats.
          </p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
