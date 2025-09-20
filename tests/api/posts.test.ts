import { GET, POST } from '@/app/api/posts/route'
import { NextRequest } from 'next/server'

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('/api/posts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('fetches posts successfully', async () => {
      const mockPosts = [
        { id: '1', titulo: 'Post 1', resumo: 'Summary 1', conteudo: 'Content 1' },
        { id: '2', titulo: 'Post 2', resumo: 'Summary 2', conteudo: 'Content 2' }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockPosts))
      })

      const request = new NextRequest('http://localhost:3000/api/posts')
      const response = await GET(request)
      const data = await response.json()

      expect(mockFetch).toHaveBeenCalledWith('https://blog-dinamico-app.onrender.com/posts')
      expect(data).toEqual(mockPosts)
    })

    it('fetches posts with search query', async () => {
      const mockPosts = [
        { id: '1', titulo: 'Searched Post', resumo: 'Summary', conteudo: 'Content' }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockPosts))
      })

      const request = new NextRequest('http://localhost:3000/api/posts?query=search%20term')
      const response = await GET(request)
      const data = await response.json()

      expect(mockFetch).toHaveBeenCalledWith(
        'https://blog-dinamico-app.onrender.com/posts/search?query=search%20term'
      )
      expect(data).toEqual(mockPosts)
    })

    it('handles empty response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('')
      })

      const request = new NextRequest('http://localhost:3000/api/posts')
      const response = await GET(request)
      const data = await response.json()

      expect(data).toEqual([])
    })

    it('handles backend error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      const request = new NextRequest('http://localhost:3000/api/posts')
      const response = await GET(request)
      const data = await response.json()

      expect(data).toEqual([])
    })

    it('handles network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const request = new NextRequest('http://localhost:3000/api/posts')
      const response = await GET(request)
      const data = await response.json()

      expect(data).toEqual([])
    })

    it('handles different response formats', async () => {
      const mockResponse = {
        posts: [
          { id: '1', titulo: 'Post 1' }
        ]
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockResponse))
      })

      const request = new NextRequest('http://localhost:3000/api/posts')
      const response = await GET(request)
      const data = await response.json()

      expect(data).toEqual(mockResponse.posts)
    })

    it('adds id to posts without id', async () => {
      const mockPosts = [
        { titulo: 'Post without ID', professor_id: 123 }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockPosts))
      })

      const request = new NextRequest('http://localhost:3000/api/posts')
      const response = await GET(request)
      const data = await response.json()

      expect(data[0]).toHaveProperty('id')
      expect(data[0].id).toContain('123-')
    })
  })

  describe('POST', () => {
    it('creates post successfully', async () => {
      const newPost = {
        titulo: 'New Post',
        resumo: 'New Summary',
        conteudo: 'New Content'
      }

      const createdPost = {
        id: '123',
        ...newPost
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: () => Promise.resolve(createdPost)
      })

      const request = new NextRequest('http://localhost:3000/api/posts', {
        method: 'POST',
        body: JSON.stringify(newPost),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      // Mock cookies
      Object.defineProperty(request, 'cookies', {
        value: {
          get: jest.fn().mockReturnValue({ value: 'mock-token' })
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(mockFetch).toHaveBeenCalledWith('https://blog-dinamico-app.onrender.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-token'
        },
        body: JSON.stringify(newPost)
      })
      expect(data).toEqual(createdPost)
    })

    it('handles post creation without auth token', async () => {
      const newPost = {
        titulo: 'New Post',
        resumo: 'New Summary',
        conteudo: 'New Content'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: () => Promise.resolve({ id: '123', ...newPost })
      })

      const request = new NextRequest('http://localhost:3000/api/posts', {
        method: 'POST',
        body: JSON.stringify(newPost),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      // Mock cookies without token
      Object.defineProperty(request, 'cookies', {
        value: {
          get: jest.fn().mockReturnValue(undefined)
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(mockFetch).toHaveBeenCalledWith('https://blog-dinamico-app.onrender.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer undefined'
        },
        body: JSON.stringify(newPost)
      })
      
      expect(data).toHaveProperty('id')
    })

    it('handles backend error during post creation', async () => {
      const newPost = {
        titulo: 'New Post',
        resumo: 'New Summary',
        conteudo: 'New Content'
      }

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: 'Bad request' })
      })

      const request = new NextRequest('http://localhost:3000/api/posts', {
        method: 'POST',
        body: JSON.stringify(newPost),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      Object.defineProperty(request, 'cookies', {
        value: {
          get: jest.fn().mockReturnValue({ value: 'mock-token' })
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({ error: 'Bad request' })
    })

    it('handles network error during post creation', async () => {
      const newPost = {
        titulo: 'New Post',
        resumo: 'New Summary',
        conteudo: 'New Content'
      }

      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const request = new NextRequest('http://localhost:3000/api/posts', {
        method: 'POST',
        body: JSON.stringify(newPost),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      Object.defineProperty(request, 'cookies', {
        value: {
          get: jest.fn().mockReturnValue({ value: 'mock-token' })
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to create post' })
    })

    it('adds id to created post without id', async () => {
      const newPost = {
        titulo: 'New Post',
        resumo: 'New Summary',
        conteudo: 'New Content'
      }

      const createdPost = {
        titulo: 'New Post',
        resumo: 'New Summary',
        conteudo: 'New Content'
        // No id field
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: () => Promise.resolve(createdPost)
      })

      const request = new NextRequest('http://localhost:3000/api/posts', {
        method: 'POST',
        body: JSON.stringify(newPost),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      Object.defineProperty(request, 'cookies', {
        value: {
          get: jest.fn().mockReturnValue({ value: 'mock-token' })
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(data).toHaveProperty('id')
      expect(typeof data.id).toBe('string')
    })
  })
})