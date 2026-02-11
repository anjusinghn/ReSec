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
