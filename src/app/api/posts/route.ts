import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://blog-dinamico-app.onrender.com';

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/posts`);
    const data = await response.json();
    
    const posts = (data.posts || []).map((post: any) => ({
      ...post,
      id: post.id || post._id || String(post.professor_id) + '-' + Date.now()
    }));
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
    
    const response = await fetch(`${BACKEND_URL}/posts`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();    
    const postWithId = {
      ...data,
      id: data.id || data._id || String(Date.now())
    };
    
    return NextResponse.json(postWithId, { status: response.status });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}