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
