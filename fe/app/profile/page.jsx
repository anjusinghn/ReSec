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
      const parts = user.displayName.split(' ');
      setFormData({
        firstName: parts[0] || '',
        lastName: parts.slice(1).join(' '),
        username: user.username || '',
        email: user.email || '',
        displayName: user.displayName,
        bio: '',
        address: baseAddress
      });
      return;
    }

    setFormData({
      firstName: user.username || '',
      lastName: '',
      username: user.username || '',
      email: user.email || '',
      displayName: user.displayName || user.username || '',
      bio: '',
      address: baseAddress
    });
  }, [user, formData]);

  const handleProfilePictureUpload = async (e) => {
    e.preventDefault();
    if (!filename.trim()) {
      setUploadError('Please enter a filename');
      return;
    }

    setUploading(true);
    setUploadError('');
    setUploadResult(null);

    try {
      const response = await fetch(`${API_BASE}/api/v1/upload/profile-picture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          filename: filename,
          content: 'profile_picture_data',
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      let data;
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { raw: text };
      }

      setUploadResult({
        status: response.status,
        data,
      });

      if (!response.ok && data && typeof data === 'object' && data.error) {
        setUploadError(data.error || 'Upload failed');
      }
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-sm text-foreground/70">Loading your profile...</p>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-lg">
        <div className="rounded border border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300 p-4 text-center">
          {profileError}
        </div>
      </div>
    );
  }

  if (!user || !formData) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 grid md:grid-cols-3 gap-6">
      <div className="rounded-xl border border-black/10 dark:border-white/10 p-4 text-center space-y-3">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 mx-auto text-5xl flex items-center justify-center mb-1">
          {(user.displayName || user.username || '👤').charAt(0).toUpperCase()}
        </div>
        <div>
