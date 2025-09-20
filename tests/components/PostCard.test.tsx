import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { PostCard } from '@/components/PostCard'

// Mock the router
const mockPush = jest.fn()
const mockRouter = {
  push: mockPush,
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
}

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}))

describe('PostCard', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  const mockPost = {
    id: '1',
    titulo: 'Test Post Title',
    resumo: 'Test post summary',
    conteudo: 'Test post content',
    professor_id: 1,
    created_at: '2024-01-01T00:00:00Z',
  }

  it('renders post information correctly', () => {
    render(<PostCard post={mockPost} />)
    
    expect(screen.getByText('Test Post Title')).toBeInTheDocument()
    expect(screen.getByText('Test post summary')).toBeInTheDocument()
    expect(screen.getByText('1/1/2024')).toBeInTheDocument()
  })

  it('shows edit and delete options for logged in professors', async () => {
    const mockOnEdit = jest.fn()
    const mockOnDelete = jest.fn()
    
    render(
      <PostCard 
        post={mockPost} 
        isLoggedIn={true} 
        isProfessor={true}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )
    
    // Find the dropdown menu trigger button
    const menuTrigger = screen.getByRole('button')
    fireEvent.click(menuTrigger)
    
    // Wait for dropdown content to appear
    await waitFor(() => {
      expect(screen.getByText('View Post')).toBeInTheDocument()
      expect(screen.getByText('Editar Post')).toBeInTheDocument()
      expect(screen.getByText('Excluir Post')).toBeInTheDocument()
    })
  })

  it('calls onEdit when edit button is clicked', async () => {
    const mockOnEdit = jest.fn()
    
    render(
      <PostCard 
        post={mockPost} 
        isLoggedIn={true} 
        isProfessor={true}
        onEdit={mockOnEdit}
      />
    )
    
    // Click the dropdown menu trigger
    const menuTrigger = screen.getByRole('button')
    fireEvent.click(menuTrigger)
    
    // Wait for dropdown and click edit option
    await waitFor(() => {
      const editButton = screen.getByText('Editar Post')
      fireEvent.click(editButton)
    })
    
    expect(mockOnEdit).toHaveBeenCalledWith(mockPost)
  })

  it('calls onDelete when delete button is clicked', async () => {
    const mockOnDelete = jest.fn()
    
    render(
      <PostCard 
        post={mockPost} 
        isLoggedIn={true} 
        isProfessor={true}
        onDelete={mockOnDelete}
      />
    )
    
    // Click the dropdown menu trigger
    const menuTrigger = screen.getByRole('button')
    fireEvent.click(menuTrigger)
    
    // Wait for dropdown and click delete option
    await waitFor(() => {
      const deleteButton = screen.getByText('Excluir Post')
      fireEvent.click(deleteButton)
    })
    
    expect(mockOnDelete).toHaveBeenCalledWith('1')
  })

  it('handles posts without optional fields', () => {
    const minimalPost = {
      id: '2',
      titulo: 'Minimal Post',
    }
    
    render(<PostCard post={minimalPost} />)
    
    expect(screen.getByText('Minimal Post')).toBeInTheDocument()
  })

  it('does not show edit/delete options for non-professors', () => {
    render(
      <PostCard 
        post={mockPost} 
        isLoggedIn={true} 
        isProfessor={false}
      />
    )
    
    expect(screen.queryByRole('button', { name: /more options/i })).not.toBeInTheDocument()
  })

  it('does not show edit/delete options for non-logged in users', () => {
    render(
      <PostCard 
        post={mockPost} 
        isLoggedIn={false} 
        isProfessor={true}
      />
    )
    
    expect(screen.queryByRole('button', { name: /more options/i })).not.toBeInTheDocument()
  })
})