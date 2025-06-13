# Vision Group API Gateway

A high-performance API gateway for the Vision Group ecosystem, providing centralized routing, authentication, and request management for all backend services.

![CI Pipeline](https://github.com/vision-group-vgad/api/workflows/API%20Gateway%20CI%20Pipeline/badge.svg)
![License](https://img.shields.io/badge/license-Proprietary-red)
![Node](https://img.shields.io/badge/node-22.16-green)
![API Version](https://img.shields.io/badge/api-v1-blue)

## 🚀 Overview

The Vision Group API Gateway serves as the single entry point for all client applications, providing:

- **Unified API Interface** - Single endpoint for all services
- **Authentication & Authorization** - JWT-based security
- **Rate Limiting** - Request throttling and abuse prevention
- **Request Routing** - Intelligent routing to backend services
- **Monitoring & Logging** - Comprehensive request tracking
- **CORS Management** - Cross-origin request handling

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client Apps   │───▶│   API Gateway    │───▶│ Backend Services│
│                 │    │                  │    │                 │
│ • Web App       │    │ • Authentication │    │ • User Service  │
│ • Mobile App    │    │ • Rate Limiting  │    │ • Order Service │
│ • Third Party   │    │ • Request Routing│    │ • Payment API   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📋 Prerequisites

- Node.js 22.x (LTS)
- npm package manager
- Git

## 🛠️ Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/vision-group-vgad/api.git

# Navigate to project directory
cd api

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev

# Run tests
npm test

# Run linting
npm run lint

# Check code formatting
npm run format:check
```

## 🔧 Environment Variables

Note: Commented out variables are optional.

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# API Configuration
API_VERSION=v1
API_BASE_URL=http://localhost:4000/api/v1

# Authentication
JWT_SECRET=super_secret_jwt_key_change_in_production_12345
JWT_EXPIRES_IN=24h

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,https://dev.vgad.local

# Database
DATABASE_URL=postgresql://api_user:dev_password@localhost:5432/vgad_api_dev

# Monitoring
LOG_LEVEL=info
ENABLE_REQUEST_LOGGING=true
METRICS_PORT=9090

<!-- # Backend Services

# Redis Cache
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=dev_redis_password

# External APIs
THIRD_PARTY_API_KEY=dummy_api_key_12345
NOTIFICATION_SERVICE_URL=http://localhost:4004
EMAIL_SERVICE_API_KEY=email_service_key_67890

# Security
ENCRYPTION_KEY=32_character_encryption_key_here
BCRYPT_ROUNDS=12
SESSION_SECRET=session_secret_key_change_me_98765 -->
```

## 🚦 Development Workflow

We follow **trunk-based development** with short-lived feature branches:

1. **Create feature branch** from `main`
2. **Make changes** and commit following conventional commits
3. **Create Pull Request** with proper description
4. **Code review** and CI checks must pass
5. **Merge to `main`** after approval

### Branch Protection Rules

- ✅ **No direct pushes** to `main` branch
- ✅ **Pull request required** for all changes
- ✅ **Code review required** before merge
- ✅ **CI checks must pass** before merge
- ✅ **Branch must be up-to-date** before merge

For detailed workflow guidelines, see [CONTRIBUTION.md](./CONTRIBUTION.md).

## 🔍 CI/CD Pipeline

Our CI pipeline runs on every Pull Request and includes:

- ✅ **Code Quality Checks** - ESLint, Prettier, TypeScript
- ✅ **Security Scanning** - npm audit for vulnerabilities
- ✅ **Unit & Integration Tests** - Comprehensive test coverage
- ✅ **Configuration Validation** - API schema and config validation

## 🛠️ Available Scripts

| Script                  | Description                              |
| ----------------------- | ---------------------------------------- |
| `npm run dev`           | Start development server with hot reload |
| `npm start`             | Start production server                  |
| `npm test`              | Run all tests                            |
| `npm run test:watch`    | Run tests in watch mode                  |
| `npm run test:coverage` | Run tests with coverage report           |
| `npm run lint`          | Run ESLint                               |
| `npm run lint:fix`      | Fix ESLint issues automatically          |
| `npm run format:check`  | Check code formatting                    |
| `npm run format:fix`    | Fix code formatting                      |
| `npm run type-check`    | Run TypeScript type checking             |

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Rate Limiting** - Prevent API abuse and DDoS attacks
- **CORS Protection** - Controlled cross-origin access
- **Input Validation** - Request payload validation
- **Security Headers** - Helmet.js security headers
- **Audit Logging** - Comprehensive request/response logging

## 📊 Monitoring & Logging

### Request Logging

All API requests are logged with:

- Request ID
- HTTP method and path
- Response status and time
- User information (if authenticated)
- IP address and user agent

### Health Monitoring

```bash
# Check API health
curl http:4000//localhost:4000/api/v1/health

# Response
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0",
  "uptime": "2d 5h 30m"
}
```

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](./CONTRIBUTION.md) for:

- Development workflow and branch strategy
- Code standards and best practices
- Pull request process
- Testing guidelines
- API design principles

## 📚 Documentation

- [Contributing Guidelines](./CONTRIBUTION.md) - How to contribute to this project

## 📈 Performance

### Response Times (95th percentile)

- Authentication: < 100ms
- User queries: < 150ms

### Rate Limits

- **Authenticated users**: 1000 requests/15min

## 📄 License

This project is proprietary to Vision Group. All rights reserved.

## 🏷️ Version History

- **v1.2.0** - Added rate limiting and enhanced security
- **v1.1.0** - Implemented JWT authentication
- **v1.0.0** - Initial API gateway release

---

**Made with ❤️ by the VGAD Backend Team**

For questions or support, reach out to the development team or create an issue in this repository.
