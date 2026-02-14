'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const cartItems = [
    { id: 1, name: 'Premium Headphones', priceCents: 9999, qty: 1 },
    { id: 2, name: 'Smart Watch', priceCents: 29999, qty: 2 }
  ];
  const subtotal = cartItems.reduce((s,i)=> s+i.priceCents*i.qty,0);
  const shipping = 999; const tax = Math.floor(subtotal*0.08); const total = subtotal+shipping+tax;

  return (
    <div className="container mx-auto px-4 py-8 grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between mb-2">
          {[1,2,3].map(s => (
            <div key={s} className="text-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto ${step>=s?'bg-blue-600 text-white':'bg-black/5 dark:bg-white/10'}`}>{s}</div>
              <div className="text-xs mt-1">{['Shipping','Payment','Review'][s-1]}</div>
            </div>
          ))}
