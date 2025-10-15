# Contributing to Homelab Management Application

Thank you for your interest in contributing to this project! This document provides guidelines for contributing.

## Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/homelab.git
   cd homelab
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Start Development**
   ```bash
   # Start databases
   docker-compose up -d mongo redis
   
   # Start app in development mode
   npm run dev
   ```

## Development Guidelines

### Code Style
- Use consistent JavaScript ES6+ syntax
- Follow existing code patterns
- Add comments for complex logic
- Keep functions small and focused

### Testing
- Run tests before submitting: `npm test`
- Add tests for new features
- Ensure test coverage remains above 20%

### Security
- Never commit sensitive data (.env files, certificates)
- Use environment variables for configuration
- Follow existing security middleware patterns

## Submitting Changes

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write clear, descriptive commit messages
   - Keep commits focused and atomic
   - Test your changes locally

3. **Submit Pull Request**
   - Describe what your changes do
   - Include any relevant issue numbers
   - Ensure all tests pass

## Reporting Issues

When reporting bugs or requesting features:

- **Check existing issues** first
- **Provide clear description** of the problem
- **Include steps to reproduce** for bugs
- **Specify your environment** (OS, Node version, etc.)

## Architecture Notes

### Project Structure
- `app.js` - Main application server
- `routes/` - Express route handlers
- `models/` - MongoDB/Mongoose schemas
- `views/` - EJS templates
- `config/` - Authentication and database config
- `middleware/` - Security and error handling

### Key Features
- **Security**: CSRF protection, rate limiting, helmet
- **Authentication**: Passport.js with local strategy
- **Databases**: MongoDB for data, Redis for sessions
- **SSL/HTTPS**: Automatic certificate detection
- **Multi-architecture**: Supports AMD64 and ARM64

## Questions?

Feel free to open an issue for any questions about contributing or the codebase.