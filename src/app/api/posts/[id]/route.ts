import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://blog-dinamico-app.onrender.com/posts';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const response = await fetch(`${BACKEND_URL}/${id}`);
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    const text = await response.text();
    if (!text.trim()) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    const data = JSON.parse(text);
    return NextResponse.json(data.post || data);
  } catch (error) {
    console.error('GET Post Error:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const response = await fetch(`${BACKEND_URL}/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    
    const text = await response.text();
    if (!text.trim()) {
      return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
    
    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const response = await fetch(`${BACKEND_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}