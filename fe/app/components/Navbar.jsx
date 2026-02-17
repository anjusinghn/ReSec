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
