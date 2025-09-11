import { NextRequest, NextResponse } from 'next/server';
import { createAdminToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 });
    }

    const adminPassword = process.env.NEXT_ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error('NEXT_ADMIN_PASSWORD not configured');
      return NextResponse.json({ error: 'Admin authentication not configured' }, { status: 500 });
    }

    if (password === adminPassword) {
      const token = await createAdminToken();
      return NextResponse.json({ 
        success: true, 
        authenticated: true, 
        token 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        authenticated: false, 
        error: 'Password non valida' 
      }, { status: 401 });
    }

  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}