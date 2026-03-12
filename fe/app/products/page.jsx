import Link from 'next/link';
import { fetchWithTimeout } from '../../lib/fetchWithTimeout';

const toTitleCase = (value) => {
  if (typeof value !== 'string') return 'General';
  return value
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const formatRating = (rating) => {
  if (typeof rating === 'number' && Number.isFinite(rating)) {
    return rating.toFixed(1);
  }
  if (rating && typeof rating === 'object' && typeof rating.rate === 'number') {
    return rating.rate.toFixed(1);
  }
  if (typeof rating === 'string' && rating.trim().length > 0) {
    return rating;
  }
  return 'N/A';
};

const FALLBACK_PRODUCTS = [
  {
    id: 'fakestore-1',
    name: 'Fjallraven Foldsack Backpack',
    priceCents: 10995,
    imageUrl: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    category: toTitleCase("men's clothing"),
    rating: '3.9',
  },
  {
    id: 'fakestore-2',
    name: 'Mens Casual Premium Slim Fit Tee',
    priceCents: 2230,
    imageUrl: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879_.jpg',
    category: toTitleCase("men's clothing"),
    rating: '4.1',
  },
  {
    id: 'fakestore-3',
    name: 'Mens Cotton Jacket',
    priceCents: 5599,
    imageUrl: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg',
    category: toTitleCase("men's clothing"),
    rating: '4.7',
  },
  {
    id: 'fakestore-4',
    name: 'Mens Casual Slim Fit',
    priceCents: 1599,
    imageUrl: 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg',
    category: toTitleCase("men's clothing"),
    rating: '2.1',
  },
  {
    id: 'fakestore-5',
    name: "Women's Legends Naga Bracelet",
    priceCents: 69500,
    imageUrl: 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg',
    category: toTitleCase('jewelery'),
    rating: '4.6',
  },
  {
    id: 'fakestore-6',
    name: 'Solid Gold Petite Micropave Ring',
    priceCents: 16800,
    imageUrl: 'https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg',
    category: toTitleCase('jewelery'),
    rating: '3.9',
  },
  {
    id: 'fakestore-7',
    name: 'White Gold Plated Princess Ring',
    priceCents: 9990,
    imageUrl: 'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg',
    category: toTitleCase('jewelery'),
    rating: '3.0',
  },
  {
    id: 'fakestore-8',
    name: 'Pierced Owl Rose Gold Earrings',
    priceCents: 1099,
    imageUrl: 'https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_.jpg',
    category: toTitleCase('jewelery'),
    rating: '4.0',
  },
  {
    id: 'fakestore-9',
    name: 'WD 2TB Elements Portable Drive',
    priceCents: 6400,
    imageUrl: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg',
    category: toTitleCase('electronics'),
    rating: '3.3',
  },
  {
    id: 'fakestore-10',
    name: 'SanDisk SSD PLUS 1TB',
    priceCents: 5999,
    imageUrl: 'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg',
    category: toTitleCase('electronics'),
    rating: '2.9',
  }
];

async function getProducts() {
  try {
    const res = await fetchWithTimeout('https://fakestoreapi.com/products', {
      // Use ISR-style caching; avoid conflicting cache options
      next: { revalidate: 300 },
      timeout: 2500,
    });
    if (!res.ok) {
      throw new Error(`Failed to load products (${res.status})`);
    }
    const data = await res.json();
    const items = data
      .filter((item) => item?.image)
      .map((item) => ({
        id: `fakestore-${item.id}`,
