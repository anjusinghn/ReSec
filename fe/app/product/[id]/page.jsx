'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProductPage({ params }) {
  const { id: resolvedId } = use(params);
  const productId = (() => {
    const raw = String(resolvedId ?? '');
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  })();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');
  const [errorFlag, setErrorFlag] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, text: '' });
  const [submitLoading, setSubmitLoading] = useState(false);
  const fallbackProducts = {
    1: {
      id: 1,
      name: 'Fjallraven Foldsack Backpack',
      description: 'Your perfect pack for everyday use and walks in the forest.',
      priceCents: 10995,
      imageUrl: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
      categoryId: 1
    },
    2: {
      id: 2,
      name: 'Mens Casual Premium Slim Fit Tee',
      description: 'Slim-fitting style with a comfortable jersey fabric.',
      priceCents: 2230,
      imageUrl: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879_.jpg',
      categoryId: 1
    },
    3: {
      id: 3,
      name: 'Mens Cotton Jacket',
      description: 'Great outerwear jackets for Spring/Autumn/Winter.',
      priceCents: 5599,
      imageUrl: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg',
      categoryId: 2
    },
    4: {
      id: 4,
      name: 'Mens Casual Slim Fit',
      description: 'The color could be slightly different between on the screen and in practice.',
      priceCents: 1599,
      imageUrl: 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg',
      categoryId: 2
    },
    5: {
      id: 5,
      name: "Women's Legends Naga Bracelet",
      description: 'Inspired by the mythical water dragon that protects the ocean.',
      priceCents: 69500,
      imageUrl: 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg',
      categoryId: 3
    },
    6: {
      id: 6,
      name: 'Solid Gold Petite Micropave Ring',
      description: 'Satisfaction guaranteed. Lovely tiny stackable ring.',
      priceCents: 16800,
      imageUrl: 'https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg',
      categoryId: 3
    },
    7: {
      id: 7,
      name: 'White Gold Plated Princess Ring',
      description: 'Classic created wedding engagement solitaire diamond promise ring.',
      priceCents: 9990,
      imageUrl: 'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg',
      categoryId: 3
    },
    8: {
      id: 8,
      name: 'Pierced Owl Rose Gold Earrings',
      description: 'Rose Gold Plated Double Flared Tunnel Plug Earrings.',
      priceCents: 1099,
      imageUrl: 'https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_.jpg',
      categoryId: 3
    },
    9: {
      id: 9,
      name: 'WD 2TB Elements Portable Drive',
      description: 'USB 3.0 portable external hard drive with fast data transfers.',
      priceCents: 6400,
      imageUrl: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg',
      categoryId: 4
    },
    10: {
      id: 10,
      name: 'SanDisk SSD PLUS 1TB Internal SSD',
      description: 'Easy upgrade for faster boot-up, shutdown, application load and response.',
      priceCents: 5999,
