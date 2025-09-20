import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CreatePostDialog } from '@/components/CreatePostDialog'

describe('CreatePostDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: jest.fn(),
    onCreatePost: jest.fn(),
    editingPost: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders create post dialog when open', () => {
    render(<CreatePostDialog {...defaultProps} />)
    
    expect(screen.getByText('Create New Post')).toBeInTheDocument()
    expect(screen.getByLabelText('Título')).toBeInTheDocument()
    expect(screen.getByLabelText('Resumo')).toBeInTheDocument()
    expect(screen.getByLabelText('Conteúdo')).toBeInTheDocument()
  })

  it('renders edit post dialog when editing', () => {
    const editingPost = {
      id: '1',
      titulo: 'Test Title',
      resumo: 'Test Summary',
      conteudo: 'Test Content',
    }

    render(
      <CreatePostDialog 
        {...defaultProps} 
        editingPost={editingPost}
      />
    )
    
    expect(screen.getByText('Edit Post')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test Title')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test Summary')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test Content')).toBeInTheDocument()
  })

  it('calls onCreatePost with form data when creating new post', async () => {
    const mockOnCreatePost = jest.fn()
    render(<CreatePostDialog {...defaultProps} onCreatePost={mockOnCreatePost} />)
    
    // Fill form
    fireEvent.change(screen.getByLabelText(/título/i), {
      target: { value: 'New Post Title' }
    })
    fireEvent.change(screen.getByLabelText(/resumo/i), {
      target: { value: 'New Post Summary' }
    })
    fireEvent.change(screen.getByLabelText(/conteúdo/i), {
      target: { value: 'New Post Content' }
    })
    
    // Submit form
    fireEvent.click(screen.getByText('Create Post'))
    
    await waitFor(() => {
      expect(mockOnCreatePost).toHaveBeenCalledWith({
        titulo: 'New Post Title',
        resumo: 'New Post Summary',
        conteudo: 'New Post Content',
      })
    })
  })

  it('calls onCreatePost with updated data when editing post', async () => {
    const editingPost = {
      id: '1',
      titulo: 'Original Title',
      resumo: 'Original Summary',
      conteudo: 'Original Content',
    }
    const mockOnCreatePost = jest.fn()
    
    render(
      <CreatePostDialog 
        {...defaultProps} 
        editingPost={editingPost}
        onCreatePost={mockOnCreatePost}
      />
    )
    
    // Update form
    fireEvent.change(screen.getByDisplayValue('Original Title'), {
      target: { value: 'Updated Title' }
    })
    
    // Submit form
    fireEvent.click(screen.getByText('Update Post'))
    
    await waitFor(() => {
      expect(mockOnCreatePost).toHaveBeenCalledWith({
        titulo: 'Updated Title',
        resumo: 'Original Summary',
        conteudo: 'Original Content',
      })
    })
  })

  it('calls onOpenChange when dialog is closed', () => {
    const mockOnOpenChange = jest.fn()
    render(<CreatePostDialog {...defaultProps} onOpenChange={mockOnOpenChange} />)
    
    // Click cancel button
    fireEvent.click(screen.getByText('Cancel'))
    
    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })

  it('resets form when dialog is closed and reopened', () => {
    const { rerender } = render(<CreatePostDialog {...defaultProps} open={false} />)
    
    // Reopen dialog
    rerender(<CreatePostDialog {...defaultProps} open={true} />)
    
    // Form should be empty
    expect(screen.getByLabelText(/título/i)).toHaveValue('')
    expect(screen.getByLabelText(/resumo/i)).toHaveValue('')
    expect(screen.getByLabelText(/conteúdo/i)).toHaveValue('')
  })

  it('does not render when closed', () => {
    render(<CreatePostDialog {...defaultProps} open={false} />)
    
    expect(screen.queryByText('Create New Post')).not.toBeInTheDocument()
  })
})