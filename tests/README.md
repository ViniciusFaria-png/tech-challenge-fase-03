# Test Suite Documentation

This directory contains comprehensive tests for the Post Challenge application. The test suite covers components, API routes, utilities, and integration scenarios.

## Test Structure

```
tests/
├── components/           # Component unit tests
│   ├── PostCard.test.tsx
│   ├── Header.test.tsx
│   ├── FilterBar.test.tsx
│   └── CreatePostDialog.test.tsx
├── pages/               # Page component tests
│   └── Home.test.tsx
├── api/                 # API route tests
│   ├── posts.test.ts
│   └── auth/
│       └── signin.test.ts
├── utils/               # Utility function tests
│   └── postUtils.test.ts
├── integration/         # Integration tests
│   ├── auth-flow.test.tsx
│   └── post-management.test.tsx
└── README.md
```

## Test Categories

### Component Tests
- **PostCard.test.tsx**: Tests post display, navigation, and CRUD operations
- **Header.test.tsx**: Tests authentication state display and navigation
- **FilterBar.test.tsx**: Tests search functionality
- **CreatePostDialog.test.tsx**: Tests post creation and editing forms

### Page Tests
- **Home.test.tsx**: Tests the main page functionality including post loading, authentication, and user interactions

### API Tests
- **posts.test.ts**: Tests the posts API endpoints (GET, POST)
- **signin.test.ts**: Tests the authentication signin endpoint

### Utility Tests
- **postUtils.test.ts**: Tests the Post interface and type definitions

### Integration Tests
- **auth-flow.test.tsx**: Tests complete authentication workflows
- **post-management.test.tsx**: Tests complete post CRUD workflows

## Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Tests for CI
```bash
npm run test:ci
```

## Test Configuration

### Jest Configuration
- **jest.config.js**: Main Jest configuration with Next.js integration
- **jest.setup.js**: Test environment setup with mocks and global configurations

### Key Features
- **Next.js Integration**: Uses `next/jest` for proper Next.js testing setup
- **TypeScript Support**: Full TypeScript support for test files
- **JSDOM Environment**: Browser-like environment for component testing
- **Mocking**: Comprehensive mocking of Next.js router, localStorage, fetch, and browser APIs
- **Coverage Reports**: Generates coverage reports in multiple formats

## Mocking Strategy

### Global Mocks
- **Next.js Router**: Mocked for navigation testing
- **localStorage**: Mocked for authentication state testing
- **fetch**: Mocked for API call testing
- **Browser APIs**: ResizeObserver, IntersectionObserver, matchMedia

### Component Mocks
- Components are mocked in integration tests to focus on business logic
- UI components are tested individually in unit tests

## Test Patterns

### Component Testing
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { ComponentName } from '@/components/ComponentName'

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
```

### API Testing
```typescript
import { GET, POST } from '@/app/api/route'
import { NextRequest } from 'next/server'

describe('/api/endpoint', () => {
  it('should handle requests correctly', async () => {
    const request = new NextRequest('http://localhost:3000/api/endpoint')
    const response = await GET(request)
    expect(response.status).toBe(200)
  })
})
```

### Integration Testing
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import HomePage from '@/app/page'

describe('Feature Integration', () => {
  it('should handle complete user flow', async () => {
    render(<HomePage />)
    // Test complete user interactions
  })
})
```

## Coverage Goals

The test suite aims for:
- **Components**: 90%+ coverage
- **API Routes**: 85%+ coverage
- **Utilities**: 95%+ coverage
- **Integration**: Key user flows covered

## Best Practices

1. **Test Behavior, Not Implementation**: Focus on what the user sees and does
2. **Use Descriptive Test Names**: Clearly describe what is being tested
3. **Arrange-Act-Assert**: Structure tests with clear setup, action, and verification
4. **Mock External Dependencies**: Isolate units under test
5. **Test Error Cases**: Include negative test cases and error handling
6. **Keep Tests Independent**: Each test should be able to run in isolation

## Troubleshooting

### Common Issues

1. **Module Resolution**: Ensure `@/` alias is configured in jest.config.js
2. **Async Operations**: Use `waitFor` for async state updates
3. **Component Mocking**: Mock child components in integration tests
4. **Environment Variables**: Set appropriate NODE_ENV for different test scenarios

### Debug Tips

1. Use `screen.debug()` to see rendered output
2. Add `console.log` statements in tests for debugging
3. Run single test files with `npm test -- ComponentName.test.tsx`
4. Use `--verbose` flag for detailed test output

## Contributing

When adding new features:
1. Write tests for new components
2. Update existing tests if behavior changes
3. Maintain test coverage above thresholds
4. Follow existing test patterns and naming conventions