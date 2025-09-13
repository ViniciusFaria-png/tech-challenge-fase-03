import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://blog-dinamico-app.onrender.com';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    
    const url = query ? `${BACKEND_URL}/posts/search?query=${encodeURIComponent(query)}` : `${BACKEND_URL}/posts`;
    const response = await fetch(url);
    
    if (!response.ok) {
      return NextResponse.json([]);
    }
    
    const text = await response.text();
    if (!text.trim()) {
      return NextResponse.json([]);
    }
    
    const data = JSON.parse(text);
    
    let postsArray = [];
    if (Array.isArray(data)) {
      postsArray = data;
    } else if (data.posts && Array.isArray(data.posts)) {
      postsArray = data.posts;
    } else if (data.data && Array.isArray(data.data)) {
      postsArray = data.data;
    }
    
    const posts = postsArray.map((post: any) => ({
      ...post,
      id: post.id || post._id || String(post.professor_id) + '-' + Date.now()
    }));
    
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json([]);
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