import { NextRequest, NextResponse } from 'next/server';
import { submitContactForm } from '@/lib/supabase/queries';
import { rateLimit } from '@/lib/ratelimit';

export async function POST(request: NextRequest) {
  try {
    const { success } = await rateLimit('api-contact');
    if (!success)
      return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });

    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Combine subject into message if provided
    const fullMessage = subject ? `[${subject}] ${message}` : message;

    await submitContactForm({ name, email, message: fullMessage });

    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
