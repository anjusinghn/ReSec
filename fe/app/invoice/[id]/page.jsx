export default async function InvoicePage({ params, searchParams }) {
  const items = [
    { id: 1, description: 'Premium Headphones', qty: 1, priceCents: 9999 },
    { id: 2, description: 'Smart Watch', qty: 2, priceCents: 29999 }
  ];
  const subtotal = items.reduce((s,i)=> s+i.priceCents*i.qty,0); const tax=Math.floor(subtotal*0.08); const total=subtotal+tax;
  const note = searchParams?.note || '';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-end gap-2 mb-3 no-print">
        <button className="px-3 py-2 rounded border" onClick={()=>window.print()}>🖨️ Print Invoice</button>
      </div>
      <div className="rounded-xl border border-black/10 dark:border-white/10 p-6">
        <div className="grid md:grid-cols-2 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mb-2">INVOICE</h1>
            <div>
              <strong>Hackazon Inc.</strong><br/>
              456 Commerce Ave<br/>San Francisco, CA 94102<br/>United States
            </div>
          </div>
          <div className="text-right">
            <h4 className="font-semibold">INV-2025-{params.id}</h4>
            <div className="text-sm text-foreground/70">Invoice #{params.id}</div>
            <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-green-500/20 text-green-700 dark:text-green-300">Paid</span>
          </div>
        </div>

