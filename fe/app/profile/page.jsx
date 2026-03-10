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
