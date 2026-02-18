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
