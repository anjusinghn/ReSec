'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OrdersPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to user's order (order 2 belongs to the logged-in user)
    router.push('/orders/2');
  }, [router]);
