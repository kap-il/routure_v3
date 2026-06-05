import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/ratelimit';

export async function POST(request: NextRequest) {
  try {
    const { success } = await rateLimit('api-newsletter');
    if (!success)
      return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });

    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // TODO: Integrate with email service (Mailchimp, ConvertKit, Resend, etc.)
    // For now, we'll just simulate a successful subscription
    console.log('Newsletter subscription:', email);

    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter' },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
