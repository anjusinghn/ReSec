import Link from 'next/link';
import { fetchWithTimeout } from '../lib/fetchWithTimeout';

const toTitleCase = (value) => {
  if (typeof value !== 'string') return 'General';
  return value
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const FALLBACK_FEATURED = [
  {
    id: 'fakestore-1',
    name: 'Fjallraven Foldsack Backpack',
    priceCents: 10995,
    category: toTitleCase("men's clothing"),
    imageUrl: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
  },
  {
    id: 'fakestore-2',
    name: 'Mens Casual Premium Slim Fit Tee',
    priceCents: 2230,
    category: toTitleCase("men's clothing"),
    imageUrl: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879_.jpg',
  },
  {
    id: 'fakestore-3',
    name: 'Solid Gold Petite Micropave Ring',
    priceCents: 16800,
    category: toTitleCase('jewelery'),
    imageUrl: 'https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg',
  },
  {
    id: 'fakestore-4',
    name: 'SanDisk SSD PLUS 1TB',
    priceCents: 5999,
    category: toTitleCase('electronics'),
    imageUrl: 'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg',
  },
];

async function getFeaturedProducts() {
  try {
    const res = await fetchWithTimeout('https://fakestoreapi.com/products?limit=8', {
      // Use ISR-style caching; avoid conflicting cache options
      next: { revalidate: 300 },
      // Fail fast if external network is blocked
      timeout: 2500,
    });
    if (res.ok) {
      const data = await res.json();
      const withImages = data
        .filter((item) => item?.image)
        .map((item) => ({
          id: `fakestore-${item.id}`,
          name: item.title,
          priceCents: Math.round((item.price ?? 0) * 100),
          category: toTitleCase(item.category),
          imageUrl: item.image,
        }))
        .slice(0, 4);
      if (withImages.length === 4) {
        return withImages;
      }
    }
  } catch (err) {
    console.error('Failed to load featured products:', err);
  }
  return FALLBACK_FEATURED;
}

export default async function Home() {
  const products = await getFeaturedProducts();
  const heroProduct =
    products.length > 0
      ? products[Math.floor(Math.random() * products.length)]
      : FALLBACK_FEATURED[0];
  const heroLink = heroProduct?.id ? `/product/${heroProduct.id}` : '/products';

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="bg-slate-900 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">Welcome to Hackazon</h1>
                <p className="text-white/90 text-lg mb-6">Discover amazing products at unbeatable prices. Shop the latest tech, accessories, and more with fast shipping and secure checkout.</p>
                <div className="flex gap-3">
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center rounded-md bg-blue-900 text-white px-4 py-2 text-sm font-semibold border border-white/20 hover:bg-blue-800 transition"
                  >
                    Shop Now
                  </Link>
                  <Link href="/about" className="inline-flex items-center justify-center rounded-md border border-white/50 px-4 py-2 text-sm font-semibold hover:bg-white/10">Learn More</Link>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="max-w-sm mx-auto rounded-2xl bg-slate-950/80 border border-white/10 text-white shadow-2xl overflow-hidden backdrop-blur">
                  <div className="relative pt-[100%]">
                    <img
                      src={heroProduct?.imageUrl || 'https://placehold.co/600x600/0f172a/ffffff?text=Product'}
                      alt={heroProduct?.name || 'Featured product'}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-300/90">
                      {heroProduct?.category || 'Featured'}
                    </div>
                    <h3 className="text-lg font-semibold leading-tight line-clamp-2 text-white">
                      {heroProduct?.name || 'Featured Product'}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-emerald-300">
                        ${((heroProduct?.priceCents ?? 0) / 100).toFixed(2)}
                      </div>
                      <Link
                        href={heroLink}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-white/10 text-white text-sm font-semibold border border-white/20 hover:bg-white/20 transition"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
