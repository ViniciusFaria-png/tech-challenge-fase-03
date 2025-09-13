# Contributing Guide

## 🤝 Welcome Contributors

Thank you for your interest in contributing to the Teachers Blog Platform! This guide will help you get started with contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contribution Workflow](#contribution-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)

## 📜 Code of Conduct

### Our Pledge
We are committed to making participation in this project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Expected Behavior
- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager
- Git
- Code editor (VS Code recommended)

### First Time Setup
1. Fork the repository on GitHub
2. Clone your fork locally:
```bash
git clone https://github.com/YOUR_USERNAME/tech-challenge-fase-03.git
cd tech-challenge-fase-03
```

3. Add the original repository as upstream:
```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/tech-challenge-fase-03.git
```

4. Install dependencies:
```bash
npm install
```

5. Start the development server:
```bash
npm run dev
```

## 💻 Development Setup

### Environment Configuration
Create a `.env.local` file:
```env
NODE_ENV=development
BACKEND_URL=https://blog-dinamico-app.onrender.com
```

### Recommended VS Code Extensions
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- ESLint
- Prettier
- Auto Rename Tag
- Bracket Pair Colorizer

## 🔄 Contribution Workflow

### 1. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
# or
git checkout -b docs/your-documentation-update
```

### 2. Make Your Changes
- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes
```bash
npm run lint          # Check for linting errors
npm run build         # Ensure build passes
npm run dev           # Test locally
```

### 4. Commit Your Changes
Use conventional commit messages:
```bash
git add .
git commit -m "feat: add user profile component"
# or
git commit -m "fix: resolve login authentication issue"
# or
git commit -m "docs: update API documentation"
```

### Commit Message Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### 5. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## 📝 Coding Standards

### TypeScript Guidelines
- Use TypeScript for all new files
- Define proper interfaces and types
- Avoid `any` type unless absolutely necessary
- Use strict mode settings

```typescript
// Good
interface UserProps {
  id: string;
  name: string;
  email: string;
}

// Avoid
const user: any = { ... };
```

### React Component Guidelines
- Use functional components with hooks
- Define prop interfaces
- Use descriptive component names
- Keep components focused and small

```tsx
// Good
interface PostCardProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
}

export function PostCard({ post, onEdit, onDelete }: PostCardProps) {
  // Component logic
}
```

### CSS/Styling Guidelines
- Use Tailwind CSS classes
- Follow mobile-first approach
- Use semantic class names
- Maintain consistent spacing

```tsx
// Good
<div className="flex flex-col space-y-4 p-6 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-gray-900">Title</h2>
</div>
```

### File Organization
- Group related files together
- Use descriptive file names
- Follow the established folder structure
- Export components from index files when appropriate

## 🧪 Testing Guidelines

### Manual Testing Checklist
- [ ] Component renders correctly
- [ ] All interactive elements work
- [ ] Responsive design works on different screen sizes
- [ ] Error states are handled properly
- [ ] Loading states are implemented
- [ ] Accessibility features work

### Browser Testing
Test your changes in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📋 Pull Request Process

### Before Submitting
1. Ensure your code follows the style guidelines
2. Update documentation if needed
3. Test your changes thoroughly
4. Rebase your branch on the latest main branch

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Manual testing completed
- [ ] All existing functionality works
- [ ] New functionality works as expected

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
```

### Review Process
1. Automated checks must pass
2. At least one code review required
3. Address all review comments
4. Maintain clean commit history

## 🐛 Issue Guidelines

### Bug Reports
Include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS information
- Screenshots or videos if helpful

### Feature Requests
Include:
- Clear description of the feature
- Use case and benefits
- Possible implementation approach
- Mockups or examples if applicable

### Issue Labels
- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements or additions to docs
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed

## 🎯 Areas for Contribution

### High Priority
- Bug fixes
- Performance improvements
- Accessibility enhancements
- Mobile responsiveness
- Error handling improvements

### Medium Priority
- New features
- UI/UX improvements
- Code refactoring
- Documentation updates

### Good First Issues
- Documentation improvements
- Small UI fixes
- Adding loading states
- Improving error messages

## 📞 Getting Help

### Communication Channels
- GitHub Issues: For bugs and feature requests
- GitHub Discussions: For questions and general discussion
- Code Reviews: For technical feedback

### Questions?
If you have questions about contributing:
1. Check existing issues and discussions
2. Create a new issue with the `question` label
3. Be specific about what you need help with

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Project documentation

Thank you for contributing to the Teachers Blog Platform! 🎉