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
