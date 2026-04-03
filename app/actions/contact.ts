'use server';

import { createServerClient } from '@/lib/supabase/client';

export async function handleContactSubmission(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const subject = formData.get('subject') as string;
  const message = formData.get('message') as string;
  const honeypot = formData.get('website') as string;

  if (honeypot) return { success: true }; // Bot trap
  if (!name || !email || !message) return { success: false, error: 'Name, email, and message are required.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { success: false, error: 'Invalid email.' };

  try {
    const supabase = createServerClient();
    await supabase.from('contact_submissions').insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: `${subject ? `[${subject}] ` : ''}${message.trim()}`,
    });

    // Email notification via Resend (optional)
    if (process.env.RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
          body: JSON.stringify({
            from: 'Routure <noreply@routuremag.com>',
            to: 'routuremag@gmail.com',
            subject: `[Routure Contact] ${subject || 'New message'} from ${name}`,
            html: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 0;">
  <div style="padding-bottom: 24px; margin-bottom: 0;">
    <img src="https://routuremag.com/images/routure-logo.png" alt="Routure" width="216" style="display: block;" />
  </div>
  <div style="border-top: 2px solid #000; padding-top: 24px; margin-bottom: 24px;">
    <p style="font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #999; margin: 0;">Contact Form Submission</p>
  </div>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
    <tr>
      <td style="padding: 8px 0; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #999; width: 80px; vertical-align: top;">Name</td>
      <td style="padding: 8px 0; font-size: 14px; color: #333;">${name}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #999; vertical-align: top;">Email</td>
      <td style="padding: 8px 0; font-size: 14px; color: #333;"><a href="mailto:${email}" style="color: #333;">${email}</a></td>
    </tr>
    ${subject ? `<tr>
      <td style="padding: 8px 0; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #999; vertical-align: top;">Subject</td>
      <td style="padding: 8px 0; font-size: 14px; color: #333;">${subject}</td>
    </tr>` : ''}
  </table>
  <div style="background: #F5F4F2; padding: 20px; margin-bottom: 30px;">
    <p style="font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #999; margin: 0 0 8px;">Message</p>
    <p style="font-size: 14px; line-height: 1.7; color: #333; margin: 0; white-space: pre-wrap;">${message}</p>
  </div>
  <div style="border-top: 1px solid #E0E0E0; padding-top: 16px;">
    <p style="font-size: 11px; color: #CCC; margin: 0;">Sent from routuremag.com contact form</p>
  </div>
</div>`,
          }),
        });
      } catch { /* best-effort */ }
    }

    return { success: true };
  } catch {
    return { success: false, error: 'Failed to submit. Please try again.' };
  }
}
