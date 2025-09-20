import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Home from '@/app/page'

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

// Mock components for integration testing
jest.mock('@/components/Header', () => ({
  Header: ({ onCreatePost }: any) => (
    <button onClick={onCreatePost} data-testid="create-post-btn">
      Create Post
    </button>
  )
}))

jest.mock('@/components/PostCard', () => ({
  PostCard: ({ post, onEdit, onDelete }: any) => (
    <div data-testid="post-card">
      <span data-testid="post-title">{post.titulo}</span>
      <button onClick={() => onEdit(post)} data-testid="edit-btn">Edit</button>
      <button onClick={() => onDelete(post.id)} data-testid="delete-btn">Delete</button>
    </div>
  )
}))

jest.mock('@/components/FilterBar', () => ({
  FilterBar: ({ searchTerm, onSearchChange }: any) => (
    <input 
      data-testid="search-input"
      value={searchTerm} 
      onChange={(e) => onSearchChange(e.target.value)}
      placeholder="Search posts"
    />
  )
}))

jest.mock('@/components/CreatePostDialog', () => ({
  CreatePostDialog: ({ open, onCreatePost, editingPost }: any) => (
    <div data-testid="create-dialog" style={{ display: open ? 'block' : 'none' }}>
      <span data-testid="dialog-mode">
        {editingPost ? 'Edit Mode' : 'Create Mode'}
      </span>
      <button 
        onClick={() => onCreatePost({
          id: editingPost?.id,
          titulo: 'Test Post',
          resumo: 'Test Summary',
          conteudo: 'Test Content'
        })}
        data-testid="submit-btn"
      >
        Submit
      </button>
    </div>
  )
}))

describe('Post Management Integration', () => {
  const mockPosts = [
    {
      id: '1',
      titulo: 'First Post',
      resumo: 'First Summary',
      conteudo: 'First Content',
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      titulo: 'Second Post',
      resumo: 'Second Summary',
      conteudo: 'Second Content',
      created_at: '2024-01-02T00:00:00Z'
    }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    
    // Default mock for fetching posts
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockPosts)
    })
  })

  it('should load and display posts on initial render', async () => {
    render(<Home />)
    
    // Should fetch posts on mount
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/posts')
    })
    
    // Should display posts
    await waitFor(() => {
      expect(screen.getByText('First Post')).toBeInTheDocument()
      expect(screen.getByText('Second Post')).toBeInTheDocument()
    })
  })

  it('should handle search functionality', async () => {
    render(<Home />)
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('First Post')).toBeInTheDocument()
    })
    
    // Clear previous calls
    mockFetch.mockClear()
    
    // Mock search results
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([mockPosts[0]]) // Only first post matches
    })
    
    // Perform search
    const searchInput = screen.getByTestId('search-input')
    fireEvent.change(searchInput, { target: { value: 'First' } })
    
    // Should call search API with debounce
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/posts?query=First')
    }, { timeout: 1000 })
  })

  it('should handle post creation flow', async () => {
    // Mock successful post creation
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPosts) // Initial posts
    }).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        id: '3',
        titulo: 'Test Post',
        resumo: 'Test Summary',
        conteudo: 'Test Content'
      })
    }).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([
        ...mockPosts,
        {
          id: '3',
          titulo: 'Test Post',
          resumo: 'Test Summary',
          conteudo: 'Test Content'
        }
      ])
    })
    
    render(<Home />)
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('First Post')).toBeInTheDocument()
    })
    
    // Open create dialog
    fireEvent.click(screen.getByTestId('create-post-btn'))
    
    // Dialog should be open in create mode
    expect(screen.getByTestId('dialog-mode')).toHaveTextContent('Create Mode')
    
    // Submit new post
    fireEvent.click(screen.getByTestId('submit-btn'))
    
    // Should call create API
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: 'Test Post',
          resumo: 'Test Summary',
          conteudo: 'Test Content'
        })
      })
    })
    
    // Should refresh posts list
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/posts')
    })
  })

  it('should handle post editing flow', async () => {
    // Mock successful post update
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPosts) // Initial posts
    }).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        id: '1',
        titulo: 'Test Post',
        resumo: 'Test Summary',
        conteudo: 'Test Content'
      })
    }).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPosts) // Refreshed posts
    })
    
    render(<Home />)
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('First Post')).toBeInTheDocument()
    })
    
    // Click edit on first post
    const editButtons = screen.getAllByTestId('edit-btn')
    fireEvent.click(editButtons[0])
    
    // Dialog should be open in edit mode
    expect(screen.getByTestId('dialog-mode')).toHaveTextContent('Edit Mode')
    
    // Submit edited post
    fireEvent.click(screen.getByTestId('submit-btn'))
    
    // Should call update API
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/posts/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: '1',
          titulo: 'Test Post',
          resumo: 'Test Summary',
          conteudo: 'Test Content'
        })
      })
    })
  })

  it('should handle post deletion flow', async () => {
    // Mock successful post deletion
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPosts) // Initial posts
    }).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}) // Delete response
    }).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([mockPosts[1]]) // Remaining posts
    })
    
    render(<Home />)
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('First Post')).toBeInTheDocument()
    })
    
    // Click delete on first post
    const deleteButtons = screen.getAllByTestId('delete-btn')
    fireEvent.click(deleteButtons[0])
    
    // Should call delete API
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/posts/1', {
        method: 'DELETE'
      })
    })
    
    // Should refresh posts list
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/posts')
    })
  })

  it('should handle API errors gracefully', async () => {
    // Mock API error
    mockFetch.mockRejectedValueOnce(new Error('Network error'))
    
    render(<Home />)
    
    // Should show no posts message when API fails
    await waitFor(() => {
      expect(screen.getByText(/no posts found/i)).toBeInTheDocument()
    })
  })

  it('should handle empty posts response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([])
    })
    
    render(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText(/no posts found/i)).toBeInTheDocument()
    })
  })

  it('should handle post creation error', async () => {
    // Mock initial posts load
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPosts)
    })
    
    // Mock post creation error
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: 'Bad request' })
    })
    
    render(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText('First Post')).toBeInTheDocument()
    })
    
    // Open create dialog and submit
    fireEvent.click(screen.getByTestId('create-post-btn'))
    fireEvent.click(screen.getByTestId('submit-btn'))
    
    // Should handle error gracefully (no crash)
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/posts', expect.any(Object))
    })
  })

  it('should debounce search requests', async () => {
    render(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText('First Post')).toBeInTheDocument()
    })
    
    mockFetch.mockClear()
    
    const searchInput = screen.getByTestId('search-input')
    
    // Type multiple characters quickly
    fireEvent.change(searchInput, { target: { value: 'F' } })
    fireEvent.change(searchInput, { target: { value: 'Fi' } })
    fireEvent.change(searchInput, { target: { value: 'Fir' } })
    fireEvent.change(searchInput, { target: { value: 'First' } })
    
    // Should only make one API call after debounce
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith('/api/posts?query=First')
    }, { timeout: 1000 })
  })
})