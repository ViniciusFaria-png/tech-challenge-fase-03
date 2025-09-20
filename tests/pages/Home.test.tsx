import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Home from '@/app/page'

// Mock the components
jest.mock('@/components/Header', () => ({
  Header: ({ isLoggedIn, isProfessor, onCreatePost, onLogout, onLogin }: any) => (
    <div data-testid="header">
      <span>Header - Logged in: {isLoggedIn ? 'Yes' : 'No'}</span>
      <span>Professor: {isProfessor ? 'Yes' : 'No'}</span>
      <button onClick={onCreatePost}>Create Post</button>
      <button onClick={onLogout}>Logout</button>
      <button onClick={onLogin}>Login</button>
    </div>
  )
}))

jest.mock('@/components/PostCard', () => ({
  PostCard: ({ post, onEdit, onDelete }: any) => (
    <div data-testid="post-card">
      <span>{post.titulo}</span>
      <button onClick={() => onEdit(post)}>Edit</button>
      <button onClick={() => onDelete(post.id)}>Delete</button>
    </div>
  )
}))

jest.mock('@/components/FilterBar', () => ({
  FilterBar: ({ searchTerm, onSearchChange }: any) => (
    <div data-testid="filter-bar">
      <input 
        value={searchTerm} 
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search posts"
      />
    </div>
  )
}))

jest.mock('@/components/CreatePostDialog', () => ({
  CreatePostDialog: ({ open, onOpenChange, onCreatePost, editingPost }: any) => (
    <div data-testid="create-post-dialog" style={{ display: open ? 'block' : 'none' }}>
      <span>Dialog - Editing: {editingPost ? 'Yes' : 'No'}</span>
      <button onClick={() => onCreatePost({ titulo: 'Test Post', resumo: 'Test', conteudo: 'Content' })}>
        Submit
      </button>
      <button onClick={() => onOpenChange(false)}>Close</button>
    </div>
  )
}))

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([
        {
          id: '1',
          titulo: 'Test Post 1',
          resumo: 'Summary 1',
          conteudo: 'Content 1',
          created_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          titulo: 'Test Post 2',
          resumo: 'Summary 2',
          conteudo: 'Content 2',
          created_at: '2024-01-02T00:00:00Z'
        }
      ])
    })
  })

  it('renders the home page with hero section', async () => {
    render(<Home />)
    
    expect(screen.getByText(/Posts de/)).toBeInTheDocument()
    expect(screen.getByText(/Professores/)).toBeInTheDocument()
    expect(screen.getByText(/Descubra histórias inspiradoras/i)).toBeInTheDocument()
  })

  it('fetches and displays posts on load', async () => {
    render(<Home />)
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/posts')
    })

    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument()
      expect(screen.getByText('Test Post 2')).toBeInTheDocument()
    })
  })

  it('shows loading state while fetching posts', () => {
    render(<Home />)
    
    expect(screen.getByText(/loading posts/i)).toBeInTheDocument()
  })

  it('handles search functionality', async () => {
    render(<Home />)
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument()
    })

    // Search for posts
    const searchInput = screen.getByPlaceholderText('Search posts')
    fireEvent.change(searchInput, { target: { value: 'search term' } })
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/posts?query=search%20term')
    }, { timeout: 1000 })
  })

  it('handles authentication state from localStorage', () => {
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('isProfessor', 'true')
    
    render(<Home />)
    
    expect(screen.getByText(/logged in: yes/i)).toBeInTheDocument()
    expect(screen.getByText(/professor: yes/i)).toBeInTheDocument()
  })

  it('handles login functionality', () => {
    render(<Home />)
    
    const loginButton = screen.getByText('Login')
    fireEvent.click(loginButton)
    
    expect(localStorage.setItem).toHaveBeenCalledWith('isAuthenticated', 'true')
  })

  it('handles logout functionality', async () => {
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('isProfessor', 'true')
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({})
    })
    
    render(<Home />)
    
    const logoutButton = screen.getByText('Logout')
    fireEvent.click(logoutButton)
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/signout', {
        method: 'POST',
        credentials: 'include'
      })
    })
  })

  it('opens create post dialog', () => {
    render(<Home />)
    
    const createButton = screen.getByText('Create Post')
    fireEvent.click(createButton)
    
    const dialog = screen.getByTestId('create-post-dialog')
    expect(dialog).toHaveStyle('display: block')
  })

  it('handles post creation', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: '3', titulo: 'New Post' })
    })
    
    render(<Home />)
    
    // Open dialog
    const createButton = screen.getByText('Create Post')
    fireEvent.click(createButton)
    
    // Submit form
    const submitButton = screen.getByText('Submit')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: 'Test Post',
          resumo: 'Test',
          conteudo: 'Content'
        })
      })
    })
  })

  it('handles post editing', async () => {
    render(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument()
    })
    
    // Click edit on first post
    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])
    
    // Dialog should open with editing state
    expect(screen.getByText(/editing: yes/i)).toBeInTheDocument()
  })

  it('handles post deletion', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({})
    })
    
    render(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument()
    })
    
    // Click delete on first post
    const deleteButtons = screen.getAllByText('Delete')
    fireEvent.click(deleteButtons[0])
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/posts/1', {
        method: 'DELETE'
      })
    })
  })

  it('shows no posts message when no posts are available', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([])
    })
    
    render(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText(/no posts found/i)).toBeInTheDocument()
    })
  })

  it('handles fetch errors gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))
    
    render(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText(/no posts found/i)).toBeInTheDocument()
    })
  })
})