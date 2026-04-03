import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/client';

export async function GET(req: NextRequest) {
  const emailParam = req.nextUrl.searchParams.get('email');
  if (!emailParam) return new NextResponse('Missing email.', { status: 400 });

  let email: string;
  try { email = atob(emailParam); } catch { return new NextResponse('Invalid email.', { status: 400 }); }

  const supabase = createServerClient();
  await supabase.from('subscribers').update({
    status: 'unsubscribed', unsubscribed_at: new Date().toISOString(),
  }).eq('email', email.toLowerCase());

  return NextResponse.redirect(new URL('/unsubscribed', req.url));
}
