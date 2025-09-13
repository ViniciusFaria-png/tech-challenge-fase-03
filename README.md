# 📚 Posts Teachers FIAP - Tech Challenge Fase 03

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.4.7-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
</div>

<div align="center">
  <h3>🎯 A modern blog platform for teachers to share educational content and experiences</h3>
  <p>Built with Next.js, TypeScript, and Tailwind CSS</p>
</div>

---

## 🌟 Overview

**Posts Teachers FIAP** is a comprehensive blog platform designed to share educational insights, and creative lessons with a community. The platform provides an intuitive interface for content creation and management while ensuring a seamless reading experience for all users.

## 🤝 GRUPO

* RM 362457  - Alessandra  Guedes

* RM 362166 - Ana Carolina

* RM 363723 - Vinicius Faria

* RM 360942 - Vitor Freire

### ✨ Key Features

- 🔐 **Secure Authentication** - JWT-based login system for teachers
- 📝 **Content Management** - Create, edit, and delete educational posts
- 🔍 **Real-time Search** - Find posts instantly with live search functionality
- 📱 **Responsive Design** - Optimized for all devices and screen sizes
- 🎨 **Modern UI** - Clean, accessible interface built with Radix UI components
- ⚡ **Performance Optimized** - Fast loading with Next.js optimizations

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager

### Installation

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
Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15.4.7 with App Router
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **State Management**: React Hooks

### Backend Integration
- **API**: RESTful API integration
- **External Service**: `https://blog-dinamico-app.onrender.com`
- **Authentication**: JWT token-based
- **HTTP Client**: Native Fetch API

## 📖 Documentation

Comprehensive documentation is available in the following files:

- 📋 **[DOCUMENTATION.md](./DOCUMENTATION.md)** - Complete project documentation
- 🤝 **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contributing guidelines and standards
- 📡 **[API.md](./API.md)** - Detailed API documentation
- 🚀 **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment guides for various platforms

## 🏗 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── post/[id]/         # Dynamic post pages
│   ├── user/signup/       # User registration
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── Header.tsx        # Navigation header
│   ├── PostCard.tsx      # Post display component
│   └── FilterBar.tsx     # Search functionality
└── utils/                # Utility functions
    ├── postUtils.ts      # Post-related utilities
    └── userUtils.ts      # User-related utilities
```

## 🎯 User Roles & Features

### 👥 Visitors
- Browse and read all posts
- Search through content
- Responsive reading experience

### 👨‍🏫 Teachers (Authenticated)
- All visitor features
- Create new educational posts
- Edit and delete own posts
- Access to post management tools

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:

```env
NODE_ENV=development
BACKEND_URL=https://blog-dinamico-app.onrender.com
```

### TypeScript Configuration
- Strict mode enabled
- Path mapping configured (`@/*` → `./src/*`)
- Next.js plugin integration

## 🚀 Deployment

The application can be deployed to various platforms:

- **Vercel** (Recommended) - Automatic deployments
- **Netlify** - Static site hosting
- **AWS Amplify** - Full-stack deployment
- **Docker** - Containerized deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details on:

- Code of conduct
- Development setup
- Coding standards
- Pull request process

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📊 Performance

- ⚡ **Fast Loading** - Optimized with Next.js
- 📱 **Mobile First** - Responsive design approach
- 🎨 **Modern UI** - Accessible components
- 🔍 **SEO Optimized** - Meta tags and structured data

## 🔒 Security

- 🛡️ **JWT Authentication** - Secure token-based auth
- 🍪 **HTTP-only Cookies** - Secure token storage
- 🔐 **Input Validation** - XSS protection
- 🚫 **CORS Configuration** - Controlled access

## 📝 License

This project is part of the FIAP Tech Challenge Phase 3.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - Low-level UI primitives
- [Lucide](https://lucide.dev/) - Beautiful & consistent icons

## 📞 Support

For questions, issues, or support:

- 📋 Create an issue in this repository
- 📖 Check the [documentation](./DOCUMENTATION.md)
- 🔍 Review the [API documentation](./API.md)

---

<div align="center">
  <p><strong>Built with ❤️ for educators worldwide</strong></p>
  <p>FIAP Tech Challenge - Phase 3 | 2024</p>
</div>
