'use client';

import { useState, useTransition } from 'react';
import { handleContactSubmission } from '@/app/actions/contact';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const form = e.currentTarget;
    startTransition(async () => {
      const result = await handleContactSubmission(formData);
      if (result.success) {
        setStatus('success');
        setMessage("Message sent. We'll get back to you soon.");
        form.reset();
      } else {
        setStatus('error');
        setMessage(result.error || 'Failed to send.');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-lg">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-name" className="text-xs text-gray-500 uppercase tracking-wider">Name</label>
          <input id="contact-name" name="name" type="text" required disabled={isPending}
            className="px-4 py-3 border border-gray-300 text-black outline-none focus:border-black transition-colors placeholder:text-gray-400"
            placeholder="Your name" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-email" className="text-xs text-gray-500 uppercase tracking-wider">Email</label>
          <input id="contact-email" name="email" type="email" required disabled={isPending}
            className="px-4 py-3 border border-gray-300 text-black outline-none focus:border-black transition-colors placeholder:text-gray-400"
            placeholder="your@email.com" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-subject" className="text-xs text-gray-500 uppercase tracking-wider">Subject</label>
        <input id="contact-subject" name="subject" type="text" disabled={isPending}
          className="px-4 py-3 border border-gray-300 text-black outline-none focus:border-black transition-colors placeholder:text-gray-400"
          placeholder="What's this about?" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-message" className="text-xs text-gray-500 uppercase tracking-wider">Message</label>
        <textarea id="contact-message" name="message" required rows={5} disabled={isPending}
          className="px-4 py-3 border border-gray-300 text-black outline-none focus:border-black transition-colors placeholder:text-gray-400 resize-none"
          placeholder="Your message..." />
      </div>
      {/* Honeypot */}
      <input type="text" name="website" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
      <button type="submit" disabled={isPending}
        className="self-start px-8 py-3 bg-black text-white text-sm font-medium tracking-wider uppercase hover:bg-gray-900 transition-colors disabled:opacity-50">
        {isPending ? 'Sending...' : 'Send message'}
      </button>
      {status !== 'idle' && (
        <p className={`text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message}</p>
      )}
    </form>
  );
}
