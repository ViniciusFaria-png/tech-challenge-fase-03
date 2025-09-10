import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://blog-dinamico-app.onrender.com';

export async function POST(request: NextRequest) {
  console.log('POST /api/auth/signin called');
  try {
    const body = await request.json();
    console.log(`Body: ${JSON.stringify(body)}`);
    const response = await fetch(`${BACKEND_URL}/user/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    console.log(`Return from backend: ${JSON.stringify(data)}`)
    if (data.token) {
      const res = NextResponse.json(data);
      res.cookies.set('auth-token', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });
      return res;
    }
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create the user' }, { status: 500 });
  }
}