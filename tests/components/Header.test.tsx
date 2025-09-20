import { render, screen, fireEvent } from '@testing-library/react'
import { Header } from '@/components/Header'

// Mock the Login component
jest.mock('@/components/Login', () => ({
  Login: ({ open, onOpenChange, onLogin }: any) => (
    <div data-testid="login-dialog" style={{ display: open ? 'block' : 'none' }}>
      <button onClick={onLogin} data-testid="login-submit">Login</button>
      <button onClick={() => onOpenChange(false)} data-testid="login-close">Close</button>
    </div>
  )
}))

describe('Header', () => {
  const defaultProps = {
    isLoggedIn: false,
    isProfessor: false,
    onCreatePost: jest.fn(),
    onLogout: jest.fn(),
    onLogin: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the header with title', () => {
    render(<Header {...defaultProps} />)
    
    expect(screen.getByText('PostsHub')).toBeInTheDocument()
  })

  it('shows signin button when user is not logged in', () => {
    render(<Header {...defaultProps} />)
    
    expect(screen.getByText('SignIn')).toBeInTheDocument()
  })

  it('shows create post and logout buttons when professor is logged in', () => {
    render(
      <Header 
        {...defaultProps} 
        isLoggedIn={true} 
        isProfessor={true} 
      />
    )
    
    expect(screen.getByText('Create Post')).toBeInTheDocument()
    expect(screen.getByText('Logout')).toBeInTheDocument()
  })

  it('shows only logout button when non-professor is logged in', () => {
    render(
      <Header 
        {...defaultProps} 
        isLoggedIn={true} 
        isProfessor={false} 
      />
    )
    
    expect(screen.queryByText('Create Post')).not.toBeInTheDocument()
    expect(screen.getByText('Logout')).toBeInTheDocument()
  })

  it('opens login dialog when signin button is clicked', () => {
    render(<Header {...defaultProps} />)
    
    const signinButton = screen.getByText('SignIn')
    fireEvent.click(signinButton)
    
    expect(screen.getByTestId('login-dialog')).toHaveStyle('display: block')
  })

  it('calls onCreatePost when create post button is clicked', () => {
    const mockOnCreatePost = jest.fn()
    render(
      <Header 
        {...defaultProps} 
        isLoggedIn={true} 
        isProfessor={true}
        onCreatePost={mockOnCreatePost}
      />
    )
    
    const createButton = screen.getByText('Create Post')
    fireEvent.click(createButton)
    
    expect(mockOnCreatePost).toHaveBeenCalledTimes(1)
  })

  it('calls onLogout when logout button is clicked', () => {
    const mockOnLogout = jest.fn()
    render(
      <Header 
        {...defaultProps} 
        isLoggedIn={true} 
        isProfessor={true}
        onLogout={mockOnLogout}
      />
    )
    
    const logoutButton = screen.getByText('Logout')
    fireEvent.click(logoutButton)
    
    expect(mockOnLogout).toHaveBeenCalledTimes(1)
  })

  it('calls onLogin when login is submitted', () => {
    const mockOnLogin = jest.fn()
    render(<Header {...defaultProps} onLogin={mockOnLogin} />)
    
    // Open login dialog
    const signinButton = screen.getByText('SignIn')
    fireEvent.click(signinButton)
    
    // Submit login
    const loginSubmit = screen.getByTestId('login-submit')
    fireEvent.click(loginSubmit)
    
    expect(mockOnLogin).toHaveBeenCalledTimes(1)
  })
})