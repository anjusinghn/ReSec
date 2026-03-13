'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id;
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [customNote, setCustomNote] = useState('');
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    setLoading(true);
    setError('');
    
    try {
      // For any order other than 2, automatically apply SQLi to retrieve admin's order
      const effectiveId = orderId === '2' ? '2' : `${orderId} OR 1=1--`;
      const target = `${API_BASE}/api/v1/orders/${encodeURIComponent(effectiveId)}`;
      const response = await fetch(target, {
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError('Access Restricted: This order does not belong to you or does not exist.');
        } else if (response.status === 401) {
          setError('Please login to view orders');
        } else {
          const data = await response.json();
          setError(data.error || 'Failed to load order');
        }
        return;
      }

      const data = await response.json();
      setOrder(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateInvoice = async () => {
    setInvoiceLoading(true);
    setInvoiceData(null);

    try {
      const params = new URLSearchParams();
      if (customNote.trim()) {
        params.append('note', customNote);
      }
      
      // For any order other than 2, always target admin's invoice (id=1)
      const invoiceTargetId = orderId === '2' ? '2' : '1';
      const url = `${API_BASE}/api/v1/invoice/${invoiceTargetId}${params.toString() ? '?' + params.toString() : ''}`;
      
      const response = await fetch(url, {
        credentials: 'include'
      });

      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Failed to generate invoice');
      } else {
        setInvoiceData(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setInvoiceLoading(false);
    }
  };

  const loadTemplate = (template) => {
    const templates = {
      basic: 'Thank you for your purchase!',
      customer: 'Dear {{customer.name}}, thank you!',
      total: 'Total amount: ${{total}}',
      flag: '{{flag}}'
    };
    setCustomNote(templates[template]);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-2">Access Restricted</h1>
            <p className="text-red-600 dark:text-red-300 mb-6">{error}</p>
            <div className="space-x-4">
              <Link href="/orders/2" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                View Your Orders
              </Link>
              <Link href="/" className="inline-block px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'shipped': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'processing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
