import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Home from '@/app/page'

// Mock fetch for integration tests
const mockFetch = jest.fn()
global.fetch = mockFetch

// Mock components to focus on integration logic
jest.mock('@/components/Header', () => ({
  Header: ({ isLoggedIn, isProfessor, onLogin, onLogout }: any) => (
    <div data-testid="header">
      <span data-testid="auth-status">
        {isLoggedIn ? 'Authenticated' : 'Not Authenticated'}
      </span>
      <span data-testid="professor-status">
        {isProfessor ? 'Professor' : 'Not Professor'}
      </span>
      <button onClick={onLogin} data-testid="login-btn">Login</button>
      <button onClick={onLogout} data-testid="logout-btn">Logout</button>
    </div>
  )
}))

jest.mock('@/components/PostCard', () => ({
  PostCard: ({ post }: any) => (
    <div data-testid="post-card">{post.titulo}</div>
  )
}))

jest.mock('@/components/FilterBar', () => ({
  FilterBar: ({ searchTerm, onSearchChange }: any) => (
    <input 
      data-testid="search-input"
      value={searchTerm} 
      onChange={(e) => onSearchChange(e.target.value)}
    />
  )
}))

jest.mock('@/components/CreatePostDialog', () => ({
  CreatePostDialog: () => <div data-testid="create-dialog" />
}))

describe('Authentication Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    
    // Default mock for posts API
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([
        { id: '1', titulo: 'Test Post', resumo: 'Summary', conteudo: 'Content' }
      ])
    })
  })

  it('should handle complete login flow', async () => {
    render(<Home />)
    
    // Initially not authenticated
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated')
    expect(screen.getByTestId('professor-status')).toHaveTextContent('Not Professor')
    
    // Click login
    fireEvent.click(screen.getByTestId('login-btn'))
    
    // Should update authentication state
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated')
    })
    
    // Check localStorage was updated
    expect(localStorage.setItem).toHaveBeenCalledWith('isAuthenticated', 'true')
  })

  it('should handle complete logout flow', async () => {
    // Start with authenticated state
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('isProfessor', 'true')
    
    // Mock logout API
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({})
    })
    
    render(<Home />)
    
    // Initially authenticated
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated')
    expect(screen.getByTestId('professor-status')).toHaveTextContent('Professor')
    
    // Click logout
    fireEvent.click(screen.getByTestId('logout-btn'))
    
    // Should call logout API
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/signout', {
        method: 'POST',
        credentials: 'include'
      })
    })
    
    // Should update authentication state
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated')
      expect(screen.getByTestId('professor-status')).toHaveTextContent('Not Professor')
    })
  })

  it('should persist authentication state from localStorage', () => {
    // Set initial state in localStorage
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('isProfessor', 'true')
    
    render(<Home />)
    
    // Should read from localStorage on mount
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated')
    expect(screen.getByTestId('professor-status')).toHaveTextContent('Professor')
  })

  it('should handle partial authentication state', () => {
    // User is authenticated but not a professor
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('isProfessor', 'false')
    
    render(<Home />)
    
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated')
    expect(screen.getByTestId('professor-status')).toHaveTextContent('Not Professor')
  })

  it('should handle logout API failure gracefully', async () => {
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('isProfessor', 'true')
    
    // Mock logout API failure
    mockFetch.mockRejectedValueOnce(new Error('Network error'))
    
    render(<Home />)
    
    // Click logout
    fireEvent.click(screen.getByTestId('logout-btn'))
    
    // Should still clear local state even if API fails
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated')
      expect(screen.getByTestId('professor-status')).toHaveTextContent('Not Professor')
    })
  })

  it('should clear authentication state on logout', async () => {
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('isProfessor', 'true')
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({})
    })
    
    render(<Home />)
    
    fireEvent.click(screen.getByTestId('logout-btn'))
    
    await waitFor(() => {
      expect(localStorage.removeItem).toHaveBeenCalledWith('isAuthenticated')
      expect(localStorage.removeItem).toHaveBeenCalledWith('isProfessor')
    })
  })

  it('should handle authentication state changes during session', async () => {
    render(<Home />)
    
    // Start not authenticated
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated')
    
    // Login
    fireEvent.click(screen.getByTestId('login-btn'))
    
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated')
    })
    
    // Mock logout
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({})
    })
    
    // Logout
    fireEvent.click(screen.getByTestId('logout-btn'))
    
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated')
    })
  })
})