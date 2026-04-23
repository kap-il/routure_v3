'use client';

import { useState, useTransition } from 'react';
import { subscribeNewsletter } from '@/app/actions/newsletter';

export default function NewsletterInline() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    startTransition(async () => {
      const res = await subscribeNewsletter(email);
      if (res.success) {
        setStatus('ok');
        setError(null);
      } else {
        setStatus('err');
        setError(res.error ?? 'Something went wrong.');
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-[1fr_auto] items-end gap-5">
      <div>
        <label
          htmlFor="newsletter-email"
          className="font-mono text-[10px] tracking-[0.24em] uppercase text-white/45"
        >
          Email address
        </label>
        <input
          id="newsletter-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="nl-input"
          placeholder="you@somewhere.world"
          type="email"
          required
          disabled={pending || status === 'ok'}
          aria-describedby={error ? 'newsletter-error' : undefined}
        />
      </div>
      <button
        type="submit"
        className="btn-solid whitespace-nowrap"
        disabled={pending || status === 'ok'}
      >
        {status === 'ok' ? 'Subscribed ✓' : pending ? 'Sending…' : 'Subscribe →'}
      </button>
      {error && (
        <p
          id="newsletter-error"
          className="col-span-2 font-mono text-[10px] tracking-[0.2em] uppercase text-[#E88]"
        >
          {error}
        </p>
      )}
    </form>
  );
}
