'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
const FLAG = process.env.NEXT_PUBLIC_AFFILIATE_FLAG || 'PCTFS{pctfs_vip_coupon:R3S3CURITY143}';

const offers = [
  {
    id: 'aurora',
    name: 'Aurora Glow Kit',
    description: 'Bundle of our best-selling wellness gadgets wrapped in a holographic experience.',
    redirect: 'https://hackazon.com/campaigns/aurora-glow'
  },
  {
    id: 'velocity',
    name: 'Velocity Fitness Pack',
    description: 'High-impact active gear curated for urban athletes on the move.',
    redirect: 'https://hackazon.com/campaigns/velocity-fit'
  },
  {
    id: 'atelier',
    name: 'Atelier Home Studio',
    description: 'Design-forward workspace essentials crafted for creators and makers.',
    redirect: 'https://hackazon.com/campaigns/atelier-studio'
  }
];

export default function AffiliatePortal() {
  const searchParams = useSearchParams();
  const [notice, setNotice] = useState('');

  const [partnerName, setPartnerName] = useState('Cosmic Creatives');
  const [partnerCode, setPartnerCode] = useState('COSMIC-001');
  const [selectedOfferId, setSelectedOfferId] = useState(offers[0].id);
  const [customRedirect, setCustomRedirect] = useState(offers[0].redirect);
  const [copied, setCopied] = useState('');

  const selectedOffer = useMemo(
    () => offers.find((offer) => offer.id === selectedOfferId) ?? offers[0],
    [selectedOfferId]
  );

  const baseRedirect = selectedOffer.redirect;
  const linkModified = customRedirect.trim() !== baseRedirect;

  const referralLink = useMemo(() => {
    const params = new URLSearchParams({
      partner_id: partnerCode || 'AFFILIATE',
      redirect: customRedirect
    });
    return `${API_BASE}/api/v1/track?${params.toString()}`;
  }, [partnerCode, customRedirect]);

  const handleOfferChange = (offerId) => {
    setSelectedOfferId(offerId);
    const offer = offers.find((o) => o.id === offerId);
    if (offer) {
      setCustomRedirect(offer.redirect);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied('Link copied!');
      setTimeout(() => setCopied(''), 1600);
    } catch {
      setCopied('Unable to copy—select manually.');
      setTimeout(() => setCopied(''), 1600);
    }
  };

  const handleTestRedirect = () => {
    if (linkModified) {
      alert(`Flag: ${FLAG}`);
    }
    window.open(referralLink, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    const marker = searchParams.get('notice');
    if (marker === 'external-blocked') {
      setNotice('External redirect blocked. External domains are disabled in this lab environment.');
    } else {
      setNotice('');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.35),rgba(15,23,42,0.95)_60%)]" />
        <div className="relative container mx-auto px-4 py-16 md:py-20 text-white">
