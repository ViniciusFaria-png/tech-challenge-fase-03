# Tech Challenge Fase 03 - Teachers Blog Platform

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Components](#components)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

**Posts Teachers FIAP** is a modern blog platform designed specifically for teachers to share educational content, teaching experiences, and insights with the community. The application provides a clean, intuitive interface for creating, reading, and managing educational posts.

### Key Objectives
- Enable teachers to share educational content and experiences
- Provide a platform for educational community building
- Offer seamless content management for educators
- Ensure responsive design for all devices

## ✨ Features

### Core Features
- **User Authentication**: Secure login/signup system for teachers
- **Post Management**: Create, read, update, and delete educational posts
- **Search Functionality**: Real-time search through posts
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: Dynamic content loading and updates

### User Roles
- **Visitors**: Can browse and read posts
- **Teachers**: Can create, edit, and delete their own posts
- **Authenticated Users**: Access to personalized features

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15.4.7 (React 19.1.0)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)

### Backend Integration
- **API**: RESTful API integration
- **External Service**: `https://blog-dinamico-app.onrender.com`
- **Authentication**: JWT token-based authentication
- **HTTP Client**: Native Fetch API

### Development Tools
- **Linting**: ESLint with Next.js configuration
- **Type Checking**: TypeScript strict mode
- **Build Tool**: Next.js built-in bundler
- **Package Manager**: npm

## 📁 Project Structure

```
tech-challenge-fase-03/
├── public/                     # Static assets
│   ├── *.svg                  # Icon files
│   └── favicon.ico            # Favicon
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   └── posts/        # Posts endpoints
│   │   ├── post/[id]/        # Dynamic post pages
│   │   ├── user/signup/      # User registration
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/           # Reusable components
│   │   ├── ui/              # Base UI components
│   │   ├── CreatePostDialog.tsx
│   │   ├── FilterBar.tsx
│   │   ├── Header.tsx
│   │   ├── Login.tsx
│   │   └── PostCard.tsx
│   ├── utils/               # Utility functions
│   │   ├── postUtils.ts     # Post-related utilities
│   │   └── userUtils.ts     # User-related utilities
│   └── styles/              # Additional styles
├── .gitignore              # Git ignore rules
├── eslint.config.mjs       # ESLint configuration
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies and scripts
├── postcss.config.mjs      # PostCSS configuration
├── README.md               # Basic project info
└── tsconfig.json           # TypeScript configuration
```

## 🚀 Installation

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager

### Setup Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd tech-challenge-fase-03
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
Navigate to `http://localhost:3000`

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## ⚙️ Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# Backend API URL (if different from default)
BACKEND_URL=https://blog-dinamico-app.onrender.com

# Next.js Environment
NODE_ENV=development
```

### TypeScript Configuration
The project uses strict TypeScript configuration with:
- ES2017 target
- ESNext modules
- Path mapping (`@/*` → `./src/*`)
- Strict type checking enabled

## 📡 API Documentation

### Base URL
```
Production: https://blog-dinamico-app.onrender.com
Local API: http://localhost:3000/api
```

### Authentication Endpoints

#### POST /api/auth/signin
Login user and receive authentication token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "senha": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "isProfessor": true
  }
}
```

#### POST /api/auth/signup
Register new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "senha": "password123"
}
```

#### POST /api/auth/signout
Logout user and invalidate token.

### Posts Endpoints

#### GET /api/posts
Retrieve all posts or search posts.

**Query Parameters:**
- `query` (optional): Search term for filtering posts

**Response:**
```json
[
  {
    "id": "1",
    "titulo": "Post Title",
    "resumo": "Post summary",
    "conteudo": "Full post content",
    "professor_id": 1,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### POST /api/posts
Create new post (requires authentication).

**Request Body:**
```json
{
  "titulo": "Post Title",
  "resumo": "Post summary",
  "conteudo": "Full post content"
}
```

#### PUT /api/posts/[id]
Update existing post (requires authentication).

#### DELETE /api/posts/[id]
Delete post (requires authentication).

## 🧩 Components

### Core Components

#### Header
Navigation component with authentication controls.
- **Props**: `isLoggedIn`, `isProfessor`, `onCreatePost`, `onLogout`, `onLogin`
- **Features**: Login/logout, create post button for professors

#### PostCard
Individual post display component.
- **Props**: `post`, `isLoggedIn`, `isProfessor`, `onEdit`, `onDelete`
- **Features**: Post preview, edit/delete controls for professors

#### FilterBar
Search and filtering interface.
- **Props**: `searchTerm`, `onSearchChange`
- **Features**: Real-time search with debouncing

#### CreatePostDialog
Modal for creating/editing posts.
- **Props**: `open`, `onOpenChange`, `onCreatePost`, `editingPost`
- **Features**: Form validation, edit mode support

#### Login
Authentication modal component.
- **Props**: `open`, `onOpenChange`, `onLogin`
- **Features**: Email/password login, error handling

### UI Components
Located in `src/components/ui/`, these are reusable Radix UI-based components:
- Button, Input, Dialog, Card, Avatar, etc.
- Consistent styling with Tailwind CSS
- Accessibility features built-in

## 💻 Development

### Code Style Guidelines
- Use TypeScript for all new files
- Follow ESLint configuration
- Use functional components with hooks
- Implement proper error handling
- Add loading states for async operations

### Component Development
```tsx
// Example component structure
interface ComponentProps {
  // Define props with TypeScript
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // Component logic
  return (
    // JSX with Tailwind classes
  );
}
```

### State Management
- Use `useState` for local component state
- Use `useEffect` for side effects
- Implement proper cleanup in useEffect
- Use localStorage for client-side persistence

### API Integration
```typescript
// Example API call
const fetchData = async () => {
  try {
    const response = await fetch('/api/endpoint');
    const data = await response.json();
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Vercel Deployment (Recommended)
1. Connect repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Environment Setup
- Set `NODE_ENV=production`
- Configure backend API URL
- Set up proper CORS policies

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Review Process
- Ensure TypeScript compilation passes
- Run ESLint and fix any issues
- Test functionality thoroughly
- Update documentation if needed

### Issue Reporting
When reporting issues, include:
- Steps to reproduce
- Expected vs actual behavior
- Browser/environment details
- Screenshots if applicable

## 📝 License

This project is part of the FIAP Tech Challenge Phase 3.

## 📞 Support

For questions or support, please contact the development team or create an issue in the repository.

---

**Last Updated**: January 2024
**Version**: 0.1.0