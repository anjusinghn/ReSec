import Link from 'next/link';

async function getOrder(id) {
  return {
    id,
    date: '2025-01-15',
    status: 'Shipped',
    totalCents: 69997,
    tracking: 'TRK123456789',
    shippingAddress: { name: 'John Doe', street: '123 Main Street', city: 'New York', state: 'NY', zip: '10001', country: 'United States' },
    items: [
      { id: 1, name: 'Premium Headphones', priceCents: 9999, qty: 1, imageUrl: 'https://placehold.co/100x100/3b82f6/fff?text=HP' },
      { id: 2, name: 'Smart Watch', priceCents: 29999, qty: 2, imageUrl: 'https://placehold.co/100x100/8b5cf6/fff?text=Watch' }
    ]
  };
}

export default async function OrderDetailPage({ params }) {
  const order = await getOrder(params.id);
  const subtotal = order.items.reduce((s,i)=>s+i.priceCents*i.qty,0); const shipping=999; const tax=Math.floor(subtotal*0.08);
  const statusColor = (s)=> s==='Delivered'?'bg-green-500/20 text-green-700 dark:text-green-300': s==='Shipped'?'bg-blue-500/20 text-blue-700 dark:text-blue-300':'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300';

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/orders" className="inline-block mb-3 hover:underline">← Back to Orders</Link>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Order #{order.id}</h1>
