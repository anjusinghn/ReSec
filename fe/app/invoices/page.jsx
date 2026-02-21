'use client';

import { useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export default function InvoicesPage() {
  const [selectedFile, setSelectedFile] = useState('');
  const [customFile, setCustomFile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadResult, setDownloadResult] = useState(null);

  const commonInvoices = [
    'invoice_001.pdf',
    'invoice_002.pdf', 
    'invoice_003.pdf',
    'monthly_report.pdf',
    'quarterly_summary.pdf'
  ];

  const handleDownload = async () => {
    const fileToDownload = customFile.trim() || selectedFile;
    if (!fileToDownload) {
      setError('Please select or enter a filename');
      return;
    }

    setLoading(true);
    setError('');
    setDownloadResult(null);

    try {
      const url = new URL(`${API_BASE}/api/v1/download/invoice`);
      url.searchParams.set('file', fileToDownload);
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        credentials: 'include'
      });

      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        setDownloadResult({
          type: 'json',
          data: data,
          status: response.status
        });
        if (!response.ok) {
          setError(data.error || 'Download failed');
        }
      } else {
        const text = await response.text();
        setDownloadResult({
          type: 'file',
          data: text,
          status: response.status,
          filename: fileToDownload
        });
