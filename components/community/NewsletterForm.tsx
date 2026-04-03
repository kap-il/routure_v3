'use client';

import { useState, useTransition } from 'react';
import { subscribeNewsletter } from '@/app/actions/newsletter';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    startTransition(async () => {
      const result = await subscribeNewsletter(email);
      if (result.success) {
        setStatus('success');
        setMessage("You're in. We'll be in touch.");
        setEmail('');
      } else {
        setStatus('error');
        setMessage(result.error || 'Something went wrong.');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
      <div className="flex gap-3">
        <input type="email" value={email}
          onChange={(e) => { setEmail(e.target.value); if (status !== 'idle') setStatus('idle'); }}
          placeholder="your@email.com" required disabled={isPending}
          className="flex-1 px-4 py-3 bg-transparent border border-gray-600 text-white placeholder:text-gray-500 text-base outline-none focus:border-white transition-colors" />
        <button type="submit" disabled={isPending}
          className="px-6 py-3 bg-white text-black text-sm font-medium tracking-wider uppercase hover:bg-gray-200 transition-colors disabled:opacity-50 whitespace-nowrap">
          {isPending ? 'Subscribing...' : 'Subscribe'}
        </button>
      </div>
      {status !== 'idle' && (
        <p className={`text-sm ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>{message}</p>
      )}
      <p className="text-gray-600 text-xs">No spam. Unsubscribe anytime.</p>
    </form>
  );
}
