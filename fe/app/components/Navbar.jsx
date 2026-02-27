'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const isLoggedIn = !!user;

  useEffect(() => {
    setMounted(true);
    const syncCart = () => {
      try {
        const saved = JSON.parse(localStorage.getItem('cart') || '[]');
        const count = saved.reduce((sum, i) => sum + (i.qty || 0), 0);
        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    };

    const syncSession = () => {
      try {
        const cached = JSON.parse(localStorage.getItem('sessionUser') || 'null');
        setUser(cached);
      } catch {
        setUser(null);
      }
    };

    const fetchSession = async () => {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
      try {
        const res = await fetch(`${API_BASE}/api/v1/auth/me`, {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          if (typeof window !== 'undefined') {
            localStorage.setItem('sessionUser', JSON.stringify(data));
            window.dispatchEvent(new Event('session-sync'));
          }
        } else if (res.status === 401) {
          setUser(null);
          localStorage.removeItem('sessionUser');
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('session-sync'));
          }
        }
      } catch {
        // ignore network errors, navbar will rely on local cache
