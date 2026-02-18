'use server';

import { submitContactForm } from '@/lib/supabase/queries';

export async function handleContactSubmission(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  if (!name || !email || !message) {
    return { error: 'All fields are required.' };
  }

  if (!email.includes('@')) {
    return { error: 'Please enter a valid email address.' };
  }

  try {
    await submitContactForm({ name, email, message });
    return { success: true };
  } catch {
    return { error: 'Failed to submit. Please try again.' };
  }
}
