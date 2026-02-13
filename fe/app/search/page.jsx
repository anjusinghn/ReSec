'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';

  useEffect(() => {
    if (q || category) {
      searchProducts();
    }
  }, [q, category]);

  const searchProducts = async () => {
    setLoading(true);
    setError('');
    
    try {
      // VULNERABILITY: SQL Injection through query parameters
      // The backend does not sanitize these parameters
      const params = new URLSearchParams();
      if (q) params.append('q', q);
      if (category) params.append('category', category);
      
      const res = await fetch(`http://localhost:4000/api/v1/products/search?${params}`);
