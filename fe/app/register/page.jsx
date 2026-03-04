'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.target);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
      const response = await fetch(`${API_BASE}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username,
          email,
          password,
          displayName: `${firstName} ${lastName}`.trim()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('sessionUser', JSON.stringify({
          id: data.id,
          username: data.username,
          email: data.email,
          role: data.role,
          displayName: `${firstName} ${lastName}`.trim() || data.username,
        }));
        window.dispatchEvent(new Event('session-sync'));
      }

      setSuccess(true);
      // Redirect to home after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-md text-center">
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-8">
          <div className="text-6xl mb-3">✅</div>
          <h3 className="text-xl font-bold mb-2">Account Created!</h3>
          <p className="text-foreground/70 mb-4">You can now sign in and start shopping.</p>
          <Link href="/login" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500 inline-block">Go to Login</Link>
        </div>
      </div>
