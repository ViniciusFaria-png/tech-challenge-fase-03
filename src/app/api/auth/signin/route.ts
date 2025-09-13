import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://blog-dinamico-app.onrender.com';

export async function POST(request: NextRequest) {
  console.log('POST /api/auth/signin called');
  try {
    const body = await request.json();
    console.log(`Body: ${JSON.stringify(body)}`);
    console.log(`Making request to: ${BACKEND_URL}/user/signin`);
    
    const response = await fetch(`${BACKEND_URL}/user/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    console.log(`Response status: ${response.status}`);
    console.log(`Response ok: ${response.ok}`);
    
    const data = await response.json();
    console.log(`Return from backend: ${JSON.stringify(data)}`)
    if (data.token ) {
      const res = NextResponse.json(data);
      res.cookies.set('auth-token', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });
      return res;
    }
    
    return NextResponse.json(data, { status: 401 });
  } catch (error) {
    console.error('Error in signin API:', error);
    return NextResponse.json({ error: 'Failed to signin' }, { status: 500 });
  }
}