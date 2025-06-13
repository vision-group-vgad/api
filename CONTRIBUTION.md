# Contributing to VGAD API Gateway

Thank you for contributing to the VGAD API Gateway! This document provides comprehensive guidelines for contributing to this project.

## 📋 Table of Contents

- [Development Workflow](#-development-workflow)
- [Getting Started](#-getting-started)
- [Branch Naming Conventions](#-branch-naming-conventions)
- [Commit Message Guidelines](#-commit-message-guidelines)
- [Code Standards](#-code-standards)
- [Testing Guidelines](#-testing-guidelines)
- [Pull Request Process](#-pull-request-process)
- [API Design Guidelines](#-api-design-guidelines)

## 🚀 Development Workflow

We follow **trunk-based development** with short-lived feature branches to ensure fast integration and maintain high code quality.

### Branch Strategy

- **`main`** - Production-ready code (no direct pushes allowed)
- **`feature/description`** - New features (max 2-3 days)
- **`fix/description`** - Bug fixes
- **`hotfix/description`** - Critical production fixes
- **`chore/description`** - Maintenance tasks, refactoring

### Key Principles

- Keep branches **short-lived** (1-3 days maximum)
- Make **small, focused commits**
- **Integrate frequently** to avoid merge conflicts
- **Delete branches** immediately after merge
- **All changes require code review**
- **No direct pushes** to main branch

## 🛠️ Getting Started

### 1. Environment Setup

```bash
# Clone the repository
git clone https://github.com/vision-group-vgad/api.git
cd api

# Install Go dependencies
go mod download

# Install development tools
go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
go install github.com/swaggo/swag/cmd/swag@latest

# Copy environment file
cp .env.example .env

# Start local dependencies (Redis, PostgreSQL)
docker-compose up -d

# Run database migrations
make migrate-up

# Verify setup works
make test
make run
```

### 2. Development Tools Setup

**Required Tools:**

- Go 1.21+
- Docker & Docker Compose
- PostgreSQL client
- Redis client
- Postman or similar API testing tool

**Recommended VS Code Extensions:**

- Go (by Google)
- REST Client
- Docker
- GitLens
- Thunder Client

## 🌿 Branch Naming Conventions

Use descriptive branch names that clearly indicate the purpose:

### Format: `type/short-description`

**Examples:**

```bash
# Features
feature/user-authentication
feature/rate-limiting
feature/api-versioning

# Bug fixes
fix/cors-headers-issue
fix/jwt-token-validation
fix/database-connection-leak

# Hotfixes
hotfix/security-vulnerability
hotfix/memory-leak

# Chores
chore/update-dependencies
chore/refactor-middleware
chore/improve-logging
```

**Branch Creation:**

```bash
# Always start from latest main
git checkout main
git pull origin main

# Create and switch to new branch
git checkout -b feature/user-authentication

# Push branch to remote
git push -u origin feature/user-authentication
```

## 📝 Commit Message Guidelines

We follow the **Conventional Commits** specification for clear, structured commit messages.

### Format: `type(scope): description`

### Types:

- **`feat`** - New feature
- **`fix`** - Bug fix
- **`docs`** - Documentation changes
- **`style`** - Code style changes (formatting, etc.)
- **`refactor`** - Code refactoring
- **`test`** - Adding or updating tests
- **`chore`** - Maintenance tasks
- **`perf`** - Performance improvements
- **`security`** - Security improvements

### Examples:

```bash
# Good commit messages
git commit -m "feat: implement JWT authentication middleware"
git commit -m "fix: resolve CORS preflight request handling"
git commit -m "docs: update API documentation for user endpoints"
git commit -m "test: add integration tests for auth service"
git commit -m "refactor: extract database connection logic"
git commit -m "perf: optimize database query performance"

# With scope
git commit -m "feat(auth): implement OAuth2 integration"
git commit -m "fix(middleware): correct rate limiting logic"
git commit -m "test(handlers): add unit tests for user handlers"
```

## 🎯 Code Standards

### Go Guidelines

```go
// Use clear, descriptive function names
func AuthenticateUser(token string) (*User, error) {
    // Implementation
}

// Use proper error handling
func GetUser(id string) (*User, error) {
    user, err := userRepo.FindByID(id)
    if err != nil {
        return nil, fmt.Errorf("failed to get user %s: %w", id, err)
    }
    return user, nil
}

// Use interfaces for dependencies
type UserRepository interface {
    FindByID(id string) (*User, error)
    Create(user *User) error
    Update(user *User) error
}

// Use context for cancellation and timeouts
func (s *UserService) GetUser(ctx context.Context, id string) (*User, error) {
    // Implementation with context
}

// Use proper struct tags
type User struct {
    ID        string    `json:"id" db:"id" validate:"required"`
    Email     string    `json:"email" db:"email" validate:"required,email"`
    CreatedAt time.Time `json:"created_at" db:"created_at"`
}
```

### API Design Guidelines

```go
// RESTful endpoint structure
// GET    /api/v1/users          - List users
// GET    /api/v1/users/{id}     - Get user by ID
// POST   /api/v1/users          - Create user
// PUT    /api/v1/users/{id}     - Update user
// DELETE /api/v1/users/{id}     - Delete user

// Consistent response format
type APIResponse struct {
    Success bool        `json:"success"`
    Data    interface{} `json:"data,omitempty"`
    Error   *APIError   `json:"error,omitempty"`
    Meta    *Meta       `json:"meta,omitempty"`
}

type APIError struct {
    Code    string `json:"code"`
    Message string `json:"message"`
    Details string `json:"details,omitempty"`
}

// Use proper HTTP status codes
func (h *UserHandler) GetUser(w http.ResponseWriter, r *http.Request) {
    user, err := h.userService.GetUser(r.Context(), userID)
    if err != nil {
        if errors.Is(err, ErrUserNotFound) {
            http.Error(w, "User not found", http.StatusNotFound)
            return
        }
        http.Error(w, "Internal server error", http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(APIResponse{
        Success: true,
        Data:    user,
    })
}
```

## 🧪 Testing Guidelines

### Testing Strategy

- **Unit Tests** - Individual functions and methods (80%+ coverage)
- **Integration Tests** - API endpoints and database interactions
- **Contract Tests** - API contract validation
- **Load Tests** - Performance and scalability

### Writing Tests

```go
// Unit test example
func TestUserService_GetUser(t *testing.T) {
    tests := []struct {
        name    string
        userID  string
        want    *User
        wantErr bool
    }{
        {
            name:   "valid user ID",
            userID: "user-123",
            want:   &User{ID: "user-123", Email: "test@example.com"},
            wantErr: false,
        },
        {
            name:    "invalid user ID",
            userID:  "invalid",
            want:    nil,
            wantErr: true,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            // Test implementation
        })
    }
}

// Integration test example
func TestUserHandler_GetUser_Integration(t *testing.T) {
    // Setup test database
    db := setupTestDB(t)
    defer cleanupTestDB(t, db)

    // Create test server
    server := setupTestServer(db)

    // Make request
    req := httptest.NewRequest("GET", "/api/v1/users/123", nil)
    w := httptest.NewRecorder()

    server.ServeHTTP(w, req)

    // Assert response
    assert.Equal(t, http.StatusOK, w.Code)
}
```

### Test Commands

```bash
# Run all tests
make test

# Run tests with coverage
make test-coverage

# Run integration tests
make test-integration

# Run specific test
go test -v ./internal/handlers -run TestUserHandler

# Run tests with race detection
go test -race ./...
```

## 🔄 Pull Request Process

### 1. Before Creating PR

```bash
# Ensure your branch is up to date
git checkout main
git pull origin main
git checkout feature/your-branch
git rebase main

# Run quality checks
make lint
make test
make build

# Generate/update API documentation
make docs
```

### 2. Creating the PR

**Use the PR template and include:**

- **Clear title** following conventional commit format
- **Detailed description** of changes
- **API changes documentation**
- **Testing instructions**
- **Related issue links**
- **Breaking changes** (if any)

**PR Title Examples:**

```
feat: implement user role-based access control
fix: resolve JWT token expiration handling
docs: update API documentation for v2 endpoints
```

### 3. PR Description Template

```markdown
## 🎯 What does this PR do?

Brief description of the changes and why they were made.

## 🔗 Related Issues

Closes #123
Relates to #456

## 🧪 Testing

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed
- [ ] API documentation updated

## 📋 API Changes
```
