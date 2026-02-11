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
