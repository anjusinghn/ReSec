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
        
        if (!response.ok) {
          setError('File not found or access denied');
        }
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Invoice Downloads</h1>
          <p className="text-foreground/70 mt-2">
            Download your invoices and reports. Select from common files or enter a custom filename.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Common Invoices</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {commonInvoices.map((invoice) => (
                  <button
                    key={invoice}
                    onClick={() => {
                      setSelectedFile(invoice);
                      setCustomFile('');
                    }}
                    className={`text-left px-3 py-2 rounded border text-sm transition ${
                      selectedFile === invoice
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    📄 {invoice}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <label className="block text-sm font-semibold mb-2">Custom Filename</label>
              <input
                type="text"
                value={customFile}
                onChange={(e) => {
                  setCustomFile(e.target.value);
                  setSelectedFile('');
                }}
                placeholder="Enter filename (e.g., special_report.pdf)"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
