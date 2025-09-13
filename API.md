# API Documentation

## 📡 Overview

This document provides comprehensive documentation for the Teachers Blog Platform API. The API follows RESTful principles and uses JSON for data exchange.

## 🔗 Base URLs

```
Production: https://blog-dinamico-app.onrender.com
Local Development: http://localhost:3000/api
```

## 🔐 Authentication

The API uses JWT (JSON Web Token) based authentication. Tokens are stored in HTTP-only cookies for security.

### Authentication Flow
1. User submits credentials to `/api/auth/signin`
2. Server validates credentials and returns JWT token
3. Token is stored in HTTP-only cookie
4. Subsequent requests include token automatically
5. Server validates token for protected endpoints

## 📋 API Endpoints

### Authentication Endpoints

#### POST /api/auth/signin
Authenticate user and receive access token.

**Request:**
```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "professor@example.com",
  "senha": "securePassword123"
}
```

**Response (Success - 200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "professor@example.com",
    "isProfessor": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

**Response (Error - 401):**
```json
{
  "error": "Invalid credentials",
  "message": "Email or password is incorrect"
}
```

#### POST /api/auth/signup
Register a new user account.

**Request:**
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "newuser@example.com",
  "senha": "securePassword123"
}
```

**Response (Success - 201):**
```json
{
  "message": "Account created successfully",
  "user": {
    "id": 2,
    "email": "newuser@example.com",
    "isProfessor": false,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

**Response (Error - 400):**
```json
{
  "error": "Validation failed",
  "message": "Email already exists"
}
```

#### POST /api/auth/signout
Logout user and invalidate token.

**Request:**
```http
POST /api/auth/signout
```

**Response (Success - 200):**
```json
{
  "message": "Logged out successfully"
}
```

### Posts Endpoints

#### GET /api/posts
Retrieve all posts or search posts by query.

**Request:**
```http
GET /api/posts
# or with search
GET /api/posts?query=javascript
```

**Query Parameters:**
- `query` (optional): Search term to filter posts by title, summary, or content

**Response (Success - 200):**
```json
[
  {
    "id": "1",
    "titulo": "Introduction to React Hooks",
    "resumo": "Learn the basics of React Hooks and how to use them effectively",
    "conteudo": "React Hooks are a powerful feature that allows you to use state and other React features without writing a class...",
    "professor_id": 1,
    "created_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-01-01T10:00:00Z"
  },
  {
    "id": "2",
    "titulo": "Advanced JavaScript Concepts",
    "resumo": "Explore advanced JavaScript concepts including closures, prototypes, and async programming",
    "conteudo": "JavaScript is a versatile language with many advanced features...",
    "professor_id": 2,
    "created_at": "2024-01-02T14:30:00Z",
    "updated_at": "2024-01-02T14:30:00Z"
  }
]
```

**Response (Empty - 200):**
```json
[]
```

#### POST /api/posts
Create a new post (requires authentication).

**Request:**
```http
POST /api/posts
Content-Type: application/json
Authorization: Bearer <token>

{
  "titulo": "New Teaching Method",
  "resumo": "A revolutionary approach to teaching programming",
  "conteudo": "In this post, I'll share my experience with a new teaching method that has shown great results..."
}
```

**Response (Success - 201):**
```json
{
  "id": "3",
  "titulo": "New Teaching Method",
  "resumo": "A revolutionary approach to teaching programming",
  "conteudo": "In this post, I'll share my experience with a new teaching method that has shown great results...",
  "professor_id": 1,
  "created_at": "2024-01-03T09:15:00Z",
  "updated_at": "2024-01-03T09:15:00Z"
}
```

**Response (Error - 401):**
```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

**Response (Error - 400):**
```json
{
  "error": "Validation failed",
  "message": "Title is required"
}
```

#### GET /api/posts/[id]
Retrieve a specific post by ID.

**Request:**
```http
GET /api/posts/1
```

**Response (Success - 200):**
```json
{
  "id": "1",
  "titulo": "Introduction to React Hooks",
  "resumo": "Learn the basics of React Hooks and how to use them effectively",
  "conteudo": "React Hooks are a powerful feature that allows you to use state and other React features without writing a class. In this comprehensive guide, we'll explore the most commonly used hooks and provide practical examples...",
  "professor_id": 1,
  "created_at": "2024-01-01T10:00:00Z",
  "updated_at": "2024-01-01T10:00:00Z"
}
```

**Response (Error - 404):**
```json
{
  "error": "Not found",
  "message": "Post not found"
}
```

#### PUT /api/posts/[id]
Update an existing post (requires authentication and ownership).

**Request:**
```http
PUT /api/posts/1
Content-Type: application/json
Authorization: Bearer <token>

{
  "titulo": "Updated: Introduction to React Hooks",
  "resumo": "Updated summary with more details",
  "conteudo": "Updated content with additional examples and explanations..."
}
```

**Response (Success - 200):**
```json
{
  "id": "1",
  "titulo": "Updated: Introduction to React Hooks",
  "resumo": "Updated summary with more details",
  "conteudo": "Updated content with additional examples and explanations...",
  "professor_id": 1,
  "created_at": "2024-01-01T10:00:00Z",
  "updated_at": "2024-01-03T11:30:00Z"
}
```

**Response (Error - 403):**
```json
{
  "error": "Forbidden",
  "message": "You can only edit your own posts"
}
```

#### DELETE /api/posts/[id]
Delete a post (requires authentication and ownership).

**Request:**
```http
DELETE /api/posts/1
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "message": "Post deleted successfully"
}
```

**Response (Error - 403):**
```json
{
  "error": "Forbidden",
  "message": "You can only delete your own posts"
}
```

## 📊 Data Models

### User Model
```typescript
interface User {
  id: number;
  email: string;
  senha: string;        // Hashed password (not returned in responses)
  isProfessor: boolean;
  created_at: string;   // ISO 8601 format
  updated_at: string;   // ISO 8601 format
}
```

### Post Model
```typescript
interface Post {
  id: string;
  titulo: string;       // Post title
  resumo: string;       // Post summary/excerpt
  conteudo: string;     // Full post content
  professor_id: number; // Foreign key to User
  created_at: string;   // ISO 8601 format
  updated_at: string;   // ISO 8601 format
}
```

## 🔒 Security

### Authentication
- JWT tokens are used for authentication
- Tokens are stored in HTTP-only cookies
- Tokens expire after 7 days
- Refresh mechanism not implemented (user must re-login)

### Authorization
- Only authenticated users can create posts
- Users can only edit/delete their own posts
- All users can read posts (no authentication required)

### Data Validation
- Email format validation
- Password minimum length requirements
- Required field validation
- XSS protection through input sanitization

## 📝 Request/Response Format

### Content Type
All requests and responses use `application/json` content type.

### Request Headers
```http
Content-Type: application/json
Authorization: Bearer <jwt_token>  # For protected endpoints
```

### Response Format
All responses follow a consistent format:

**Success Response:**
```json
{
  // Data object or array
}
```

**Error Response:**
```json
{
  "error": "Error type",
  "message": "Human-readable error message"
}
```

## 🚨 Error Codes

### HTTP Status Codes
- `200` - OK (Success)
- `201` - Created (Resource created successfully)
- `400` - Bad Request (Invalid request data)
- `401` - Unauthorized (Authentication required)
- `403` - Forbidden (Access denied)
- `404` - Not Found (Resource not found)
- `500` - Internal Server Error (Server error)

### Common Error Messages
```json
// Authentication errors
{
  "error": "Unauthorized",
  "message": "Authentication required"
}

// Validation errors
{
  "error": "Validation failed",
  "message": "Title is required"
}

// Permission errors
{
  "error": "Forbidden",
  "message": "You can only edit your own posts"
}

// Not found errors
{
  "error": "Not found",
  "message": "Post not found"
}
```

## 🔄 Rate Limiting

Currently, no rate limiting is implemented. In production, consider implementing:
- Rate limiting per IP address
- Rate limiting per authenticated user
- Different limits for different endpoints

## 📱 CORS Configuration

The API supports CORS for cross-origin requests. Allowed origins should be configured based on the deployment environment.

## 🧪 Testing the API

### Using curl

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","senha":"password123"}'
```

**Get Posts:**
```bash
curl -X GET http://localhost:3000/api/posts
```

**Create Post:**
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"titulo":"Test Post","resumo":"Test summary","conteudo":"Test content"}'
```

### Using Postman
1. Import the API endpoints
2. Set up environment variables for base URL and token
3. Create a collection with all endpoints
4. Use pre-request scripts for authentication

## 📈 Performance Considerations

### Caching
- Consider implementing caching for frequently accessed posts
- Use ETags for conditional requests
- Implement browser caching headers

### Pagination
- For large datasets, implement pagination
- Use cursor-based pagination for better performance
- Include pagination metadata in responses

### Database Optimization
- Index frequently queried fields
- Optimize search queries
- Consider full-text search for content

## 🔮 Future Enhancements

### Planned Features
- User profiles and avatars
- Post categories and tags
- Comments system
- Like/favorite functionality
- File upload for images
- Rich text editor support
- Email notifications
- Social media integration

### API Versioning
Consider implementing API versioning for future updates:
- URL versioning: `/api/v1/posts`
- Header versioning: `Accept: application/vnd.api+json;version=1`

---

**Last Updated**: January 2024
**API Version**: 1.0