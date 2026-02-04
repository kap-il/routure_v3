'use client';

import { useState } from 'react';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error('Failed to subscribe');
      }

      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <section className="py-24 lg:py-32 bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-6 animate-fade-in">
            Newsletter
          </p>

          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal mb-8 animate-fade-in">
            Join Our Circle
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 mb-12 leading-relaxed animate-fade-in max-w-2xl mx-auto">
            Receive curated stories, exclusive previews, and early access to new issues.
            Be the first to know about events, collaborations, and limited editions.
          </p>

          {status === 'success' ? (
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-3 text-white mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xl">Welcome to the circle.</span>
              </div>
              <p className="text-gray-400">Check your inbox for a confirmation email.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="animate-fade-in">
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 px-6 py-4 bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-white/60 transition-colors text-center sm:text-left"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-10 py-4 bg-white text-black text-sm font-medium tracking-wider uppercase hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>

              {status === 'error' && (
                <p className="mt-4 text-red-400 text-sm">{errorMessage}</p>
              )}

              <p className="mt-6 text-xs text-gray-600">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
