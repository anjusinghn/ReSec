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
      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
        setProducts([]);
      } else {
        setProducts(data.items || []);
      }
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Search Products</h1>
      <form className="grid md:grid-cols-3 gap-3 mb-6">
        <input name="q" defaultValue={q} placeholder="Search for products..." className="px-3 py-2 rounded border border-black/10 dark:border-white/10 bg-background" />
        <select name="category" defaultValue={category} className="px-3 py-2 rounded border border-black/10 dark:border-white/10 bg-background">
          <option value="">All Categories</option>
          <option value="1">Electronics</option>
          <option value="2">Accessories</option>
          <option value="3">Clothing</option>
          <option value="4">Home</option>
        </select>
        <button type="submit" className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-500">🔍 Search</button>
      </form>

