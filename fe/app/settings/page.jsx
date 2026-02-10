'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [msg, setMsg] = useState('');
  const save = (text)=>{setMsg(text); setTimeout(()=>setMsg(''), 2500);};

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-extrabold">Settings</h1>
      {msg && (<div className="rounded border border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-300 p-3">{msg}</div>)}

      <div className="grid md:grid-cols-2 gap-6">
        <form onSubmit={(e)=>{e.preventDefault(); save('Password updated successfully!');}} className="rounded-xl border border-black/10 dark:border-white/10 p-6 space-y-3">
          <h5 className="font-semibold">🔒 Security</h5>
          <div><label className="block text-sm mb-1">Current Password</label><input type="password" className="w-full px-3 py-2 rounded border bg-background"/></div>
          <div><label className="block text-sm mb-1">New Password</label><input type="password" className="w-full px-3 py-2 rounded border bg-background"/></div>
          <div><label className="block text-sm mb-1">Confirm New Password</label><input type="password" className="w-full px-3 py-2 rounded border bg-background"/></div>
