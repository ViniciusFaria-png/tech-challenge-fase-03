import { render, screen, fireEvent } from '@testing-library/react'
import { FilterBar } from '@/components/FilterBar'

describe('FilterBar', () => {
  const defaultProps = {
    searchTerm: '',
    onSearchChange: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders search input', () => {
    render(<FilterBar {...defaultProps} />)
    
    const searchInput = screen.getByPlaceholderText('Search posts...')
    expect(searchInput).toBeInTheDocument()
  })

  it('displays current search term', () => {
    render(<FilterBar {...defaultProps} searchTerm="test search" />)
    
    const searchInput = screen.getByDisplayValue('test search')
    expect(searchInput).toBeInTheDocument()
  })

  it('calls onSearchChange when input value changes', () => {
    const mockOnSearchChange = jest.fn()
    render(<FilterBar {...defaultProps} onSearchChange={mockOnSearchChange} />)
    
    const searchInput = screen.getByPlaceholderText('Search posts...')
    fireEvent.change(searchInput, { target: { value: 'new search term' } })
    
    expect(mockOnSearchChange).toHaveBeenCalledWith('new search term')
  })

  it('handles empty search input', () => {
    const mockOnSearchChange = jest.fn()
    render(<FilterBar {...defaultProps} searchTerm="existing" onSearchChange={mockOnSearchChange} />)
    
    const searchInput = screen.getByDisplayValue('existing')
    fireEvent.change(searchInput, { target: { value: '' } })
    
    expect(mockOnSearchChange).toHaveBeenCalledWith('')
  })

  it('has correct input attributes', () => {
    render(<FilterBar {...defaultProps} />)
    
    const searchInput = screen.getByPlaceholderText('Search posts...')
    expect(searchInput).toHaveAttribute('type', 'text')
  })
})