'use client';

import { useState } from 'react';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus('success');
    setEmail('');
  };

  return (
    <section className="py-24 bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-6">
            Stay Connected
          </p>

          <h2 className="font-serif text-4xl sm:text-5xl font-normal mb-6">
            Join Our Circle
          </h2>

          <p className="text-lg text-gray-400 mb-10 leading-relaxed">
            Receive curated stories, exclusive previews, and early access to new issues delivered to your inbox.
          </p>

          {status === 'success' ? (
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-3 text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-lg">Thank you for subscribing.</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-6 py-4 bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-white/50 transition-colors"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-8 py-4 bg-white text-black text-sm font-medium tracking-wide uppercase hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          )}

          <p className="mt-6 text-xs text-gray-600">
            By subscribing, you agree to our privacy policy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
