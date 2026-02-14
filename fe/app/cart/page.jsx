'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CartPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('cart') || 'null');
      if (saved) setItems(saved);
      else setItems([
        { id: 1, name: 'Premium Headphones', priceCents: 9999, qty: 1, imageUrl: 'https://placehold.co/100x100/3b82f6/fff?text=HP' },
        { id: 2, name: 'Smart Watch', priceCents: 29999, qty: 2, imageUrl: 'https://placehold.co/100x100/8b5cf6/fff?text=Watch' }
      ]);
    } catch {}
  }, []);

  const updateQty = (id, q) => {
    const updated = items.map(i => i.id === id ? { ...i, qty: Math.max(1, q) } : i);
    setItems(updated); localStorage.setItem('cart', JSON.stringify(updated));
  };
  const remove = (id) => {
    const updated = items.filter(i => i.id !== id);
    setItems(updated); localStorage.setItem('cart', JSON.stringify(updated));
  };
