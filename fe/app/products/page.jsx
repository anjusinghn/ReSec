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
