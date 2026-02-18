'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Get in Touch</h1>
        <p className="text-foreground/70">Have questions? We'd love to hear from you.</p>
      </div>

      {submitted && (
        <div className="mb-4 rounded border border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-300 p-3">
          Thank you for your message! We'll get back to you shortly.
        </div>
      )}

      <form
        onSubmit={(e)=>{e.preventDefault(); setSubmitted(true); setTimeout(()=>setSubmitted(false), 4000);}}
        className="grid md:grid-cols-2 gap-4 rounded-xl border border-black/10 dark:border-white/10 p-6 mb-10"
      >
        <div>
