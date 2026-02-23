'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState('');

  const [success, setSuccess] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [filename, setFilename] = useState('');
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/auth/me`, {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          if (typeof window !== 'undefined') {
            localStorage.setItem('sessionUser', JSON.stringify(data));
            window.dispatchEvent(new Event('session-sync'));
          }
        } else if (res.status === 401) {
          setUser(null);
          localStorage.removeItem('sessionUser');
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('session-sync'));
          }
          router.replace('/login');
        } else {
          const body = await res.json().catch(() => ({}));
          setProfileError(body.error || 'Unable to load profile');
        }
      } catch (err) {
        setProfileError(err.message || 'Unable to load profile');
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [router]);

  useEffect(() => {
    if (!user || formData) {
      return;
    }

    const baseAddress = {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'United States'
    };

    if (user.displayName) {
