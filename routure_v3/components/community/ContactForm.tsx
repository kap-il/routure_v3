'use client';

import { useState } from 'react';

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-fade-in">
              <svg className="w-16 h-16 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 13l4 4L19 7" />
              </svg>
              <h2 className="font-serif text-4xl font-normal mb-4">Message Sent</h2>
              <p className="text-gray-700">
                Thank you for reaching out. We&apos;ll get back to you shortly.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-8 text-sm tracking-wider uppercase border-b border-black pb-1 hover:text-gray-700 hover:border-gray-700 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-6">
              Get in Touch
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl font-normal mb-6">
              Contact Us
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Have a question, want to collaborate, or interested in contributing?
              We&apos;d love to hear from you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-xs tracking-wider uppercase text-gray-500 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors bg-transparent"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs tracking-wider uppercase text-gray-500 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors bg-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-xs tracking-wider uppercase text-gray-500 mb-2">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors bg-transparent appearance-none cursor-pointer"
              >
                <option value="">Select a topic</option>
                <option value="general">General Inquiry</option>
                <option value="collaboration">Collaboration</option>
                <option value="contribution">Submit a Story</option>
                <option value="press">Press & Media</option>
                <option value="advertising">Advertising</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-xs tracking-wider uppercase text-gray-500 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors bg-transparent resize-none"
              />
            </div>

            {status === 'error' && (
              <p className="text-red-600 text-sm">{errorMessage}</p>
            )}

            <div className="text-center pt-4">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-12 py-4 bg-black text-white text-sm font-medium tracking-wider uppercase hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
