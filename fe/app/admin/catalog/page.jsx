'use client';

import { useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export default function CatalogImportPage() {
  const [xmlData, setXmlData] = useState(`<products>
  <product>
    <name>Sample Product</name>
    <price>29.99</price>
    <category>Electronics</category>
  </product>
</products>`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleImport = async (e) => {
    e.preventDefault();
    if (!xmlData.trim()) {
      setError('Please enter XML data to import');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${API_BASE}/api/v1/admin/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin': 'true'
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
        setError(data.error || 'Import failed');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadSampleXml = (type) => {
    const samples = {
      basic: `<products>
  <product>
    <name>Wireless Headphones</name>
    <price>89.99</price>
    <category>Electronics</category>
  </product>
  <product>
    <name>Coffee Mug</name>
    <price>12.99</price>
    <category>Home</category>
  </product>
</products>`,
      advanced: `<products>
  <product id="1">
    <name>Gaming Laptop</name>
    <price>1299.99</price>
    <category>Computers</category>
    <description>High-performance gaming laptop</description>
    <stock>15</stock>
  </product>
</products>`,
      bulk: `<products>
  <product><name>Item 1</name><price>10.00</price><category>Test</category></product>
  <product><name>Item 2</name><price>20.00</price><category>Test</category></product>
  <product><name>Item 3</name><price>30.00</price><category>Test</category></product>
</products>`
    };
    setXmlData(samples[type]);
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Catalog Import</h1>
          <p className="text-foreground/70 mt-2">
            Import product catalogs in XML format. This tool processes XML data and adds products to the database.
