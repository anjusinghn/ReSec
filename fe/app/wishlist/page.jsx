'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([
    { id: 1, name: 'Premium Headphones', priceCents: 9999, imageUrl: 'https://placehold.co/300x300/3b82f6/fff?text=HP', category: 'Electronics', inStock: true },
    { id: 2, name: 'Smart Watch', priceCents: 29999, imageUrl: 'https://placehold.co/300x300/8b5cf6/fff?text=Watch', category: 'Electronics', inStock: true },
    { id: 3, name: 'Laptop Stand', priceCents: 4999, imageUrl: 'https://placehold.co/300x300/10b981/fff?text=Stand', category: 'Accessories', inStock: false },
    { id: 4, name: 'Wireless Mouse', priceCents: 2999, imageUrl: 'https://placehold.co/300x300/f59e0b/fff?text=Mouse', category: 'Electronics', inStock: true }
  ]);

  const remove = (id) => setWishlist(wishlist.filter(i=> i.id!==id));

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="text-6xl mb-3">❤️</div>
        <h4 className="text-xl font-semibold mb-2">Your wishlist is empty</h4>
        <p className="text-foreground/70 mb-4">Save items you like to buy them later</p>
