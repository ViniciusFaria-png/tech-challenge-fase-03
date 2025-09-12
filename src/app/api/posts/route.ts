import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://blog-dinamico-app.onrender.com';

export async function GET() {
  try {
    console.log('Fetching from backend:', `${BACKEND_URL}/posts`);
    const response = await fetch(`${BACKEND_URL}/posts`);
    console.log('Backend response status:', response.status);
    const data = await response.json();
    console.log('Backend data:', data);
    
    // Extract posts from the response
    const posts = data.posts || [];
    console.log('Extracted posts:', posts);
    return NextResponse.json(posts);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = request.cookies.get('auth-token')?.value;
    console.log('POST body:', body);
    console.log('Token:', token);
    
    const response = await fetch(`${BACKEND_URL}/posts`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    console.log('Backend POST response status:', response.status);
    const data = await response.json();
    console.log('Backend POST response data:', data);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}