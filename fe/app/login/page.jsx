'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
      const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('sessionUser', JSON.stringify({
          id: data.id,
          username: data.username,
          email: data.email,
          role: data.role,
          displayName: data.displayName,
        }));
        window.dispatchEvent(new Event('session-sync'));
      }

      // Redirect to home on success
      router.push('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold mb-2">Welcome Back</h1>
        <p className="text-foreground/70">Sign in to your Hackazon account</p>
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300 p-3">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
