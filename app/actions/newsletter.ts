'use server';

import { createServerClient } from '@/lib/supabase/client';

const BLOCKED_DOMAINS = [
  'tempmail.com','throwaway.email','guerrillamail.com','mailinator.com',
  'yopmail.com','trashmail.com','sharklasers.com','guerrillamailblock.com',
  'grr.la','dispostable.com','maildrop.cc','fakeinbox.com','tempail.com',
  'temp-mail.org','10minutemail.com','mohmal.com','burnermail.io',
  'getnada.com','emailondeck.com','mintemail.com',
];

export async function subscribeNewsletter(email: string) {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { success: false, error: 'Please enter a valid email address.' };

  const domain = email.toLowerCase().trim().split('@')[1];
  if (BLOCKED_DOMAINS.includes(domain))
    return { success: false, error: 'Please use a permanent email address.' };

  try {
    const supabase = createServerClient();
    const { data: existing } = await supabase
      .from('subscribers').select('id, status')
      .eq('email', email.toLowerCase().trim()).single();

    if (existing) {
      if (existing.status === 'active') return { success: true };
      await supabase.from('subscribers').update({
        status: 'active', unsubscribed_at: null, subscribed_at: new Date().toISOString(),
      }).eq('id', existing.id);
      return { success: true };
    }

    const cleanEmail = email.toLowerCase().trim();
    const { error } = await supabase.from('subscribers').insert({
      email: cleanEmail, status: 'active', source: 'website',
    });
    if (error) return { success: false, error: 'Something went wrong. Please try again.' };

    // Send welcome email
    if (process.env.RESEND_API_KEY) {
      const unsubUrl = `https://routuremag.com/api/unsubscribe?email=${btoa(cleanEmail)}`;
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
          body: JSON.stringify({
            from: 'Routure <noreply@routuremag.com>',
            to: cleanEmail,
            subject: 'Welcome to Routure',
            html: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 0;">
  <div style="padding-bottom: 24px; margin-bottom: 0;">
    <img src="https://routuremag.com/images/routure-logo.png" alt="Routure" width="216" style="display: block;" />
  </div>
  <div style="border-top: 2px solid #000; padding-top: 24px; margin-bottom: 16px;">
    <h2 style="font-family: Cochin, Georgia, serif; font-size: 22px; font-weight: 700; color: #000; margin: 0;">Welcome to the circle.</h2>
  </div>
  <p style="font-size: 14px; line-height: 1.8; color: #555; margin: 0 0 24px;">
    You're now part of the Routure community. We'll let you know when new issues drop, share behind-the-scenes content, and keep you in the loop on everything we're working on.
  </p>
  <p style="font-size: 14px; line-height: 1.8; color: #555; margin: 0 0 30px;">
    In the meantime, explore our latest issue:
  </p>
  <a href="https://routuremag.com/issues" style="display: inline-block; padding: 12px 28px; background: #000; color: #fff; text-decoration: none; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Browse Issues</a>
  <div style="border-top: 1px solid #E0E0E0; margin-top: 40px; padding-top: 16px;">
    <p style="font-size: 11px; color: #CCC; margin: 0;">
      You're receiving this because you subscribed at routuremag.com.<br/>
      <a href="${unsubUrl}" style="color: #999;">Unsubscribe</a>
    </p>
  </div>
</div>`,
          }),
        });
        const resData = await res.json();
        console.log('[Resend welcome]', res.status, resData);
      } catch (e) { console.error('[Resend welcome error]', e); }
    }

    return { success: true };
  } catch {
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}
