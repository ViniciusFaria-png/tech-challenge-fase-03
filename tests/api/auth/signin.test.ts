import { POST } from '@/app/api/auth/signin/route'
import { NextRequest } from 'next/server'

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('/api/auth/signin', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock console methods to avoid noise in tests
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('signs in user successfully with token', async () => {
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    }

    const backendResponse = {
      token: 'mock-jwt-token',
      user: {
        id: 1,
        email: 'test@example.com',
        isProfessor: true
      }
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(backendResponse)
    })

    const request = new NextRequest('http://localhost:3000/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify(loginData),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(mockFetch).toHaveBeenCalledWith('https://blog-dinamico-app.onrender.com/user/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    })

    expect(data).toEqual(backendResponse)
  })

  it('handles signin failure without token', async () => {
    const loginData = {
      email: 'test@example.com',
      password: 'wrongpassword'
    }

    const backendResponse = {
      error: 'Invalid credentials'
    }

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: () => Promise.resolve(backendResponse)
    })

    const request = new NextRequest('http://localhost:3000/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify(loginData),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(data).toEqual(backendResponse)
    expect(response.status).toBe(401)
  })

  it('handles network error', async () => {
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    }

    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const request = new NextRequest('http://localhost:3000/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify(loginData),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(data).toEqual({ error: 'Failed to signin' })
    expect(response.status).toBe(500)
  })

  it('handles malformed JSON in request body', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/signin', {
      method: 'POST',
      body: 'invalid json',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(data).toEqual({ error: 'Failed to signin' })
    expect(response.status).toBe(500)
  })
})