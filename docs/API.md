# 📚 API Documentation

This document provides comprehensive information about the REST API endpoints, authentication, request/response formats, and usage examples.

## 🔗 Base URL

- **Development**: `http://localhost:3000`
- **Swagger UI**: `http://localhost:3000/api/docs`

## 🔐 Authentication

### JWT Token Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```bash
Authorization: Bearer <your-jwt-token>
```

### Public Endpoints

Some endpoints are publicly accessible without authentication:
- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /api/docs` - API documentation

## 📋 Standard Response Format

### Success Response

```json
{
  "data": {
    // Response data
  },
  "message": "Success message",
  "statusCode": 200
}
```

### Error Response

```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Validation Error Response

```json
{
  "statusCode": 400,
  "message": [
    "email must be a valid email",
    "password must be at least 6 characters long"
  ],
  "error": "Bad Request"
}
```

## 🏠 Health & System Endpoints

### Health Check

Check application and dependencies status.

**GET /health**

```bash
curl -X GET http://localhost:3000/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 120.5,
  "environment": "development"
}
```

### Welcome Message

**GET /**

```bash
curl -X GET http://localhost:3000/
```

**Response:**
```json
{
  "message": "🚀 Welcome to NestJS Enterprise API",
  "version": "1.0.0",
  "documentation": "http://localhost:3000/api/docs"
}
```

## 👥 Users API

### Create User

Create a new user account.

**POST /users**

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "roles": ["user"]
}
```

**Request Example:**
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePassword123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "roles": ["user"],
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Validation Rules:**
- `email`: Must be valid email format
- `password`: Minimum 6 characters
- `firstName`: Optional string
- `lastName`: Optional string
- `roles`: Optional array, defaults to ["user"]

### Get User by ID

Retrieve a specific user by their ID.

**GET /users/:id**

**Authentication:** Required

**Parameters:**
- `id` (string): User UUID

**Request Example:**
```bash
curl -X GET http://localhost:3000/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer <your-jwt-token>"
```

**Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "roles": ["user"],
  "isActive": true,
  "tenantId": "tenant-123",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**
- `404`: User not found
- `401`: Unauthorized
- `403`: Insufficient permissions

## 🛍️ Products API

### List Products

Retrieve a paginated list of products for the current tenant.

**GET /products**

**Authentication:** Required

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10, max: 100)
- `search` (string, optional): Search term
- `category` (string, optional): Filter by category

**Request Example:**
```bash
curl -X GET "http://localhost:3000/products?page=1&limit=10&search=laptop" \
  -H "Authorization: Bearer <your-jwt-token>"
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "product-123",
      "name": "Gaming Laptop",
      "description": "High-performance gaming laptop",
      "price": 1299.99,
      "category": "electronics",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### Get Product by ID

**GET /products/:id**

**Authentication:** Required

**Request Example:**
```bash
curl -X GET http://localhost:3000/products/product-123 \
  -H "Authorization: Bearer <your-jwt-token>"
```

**Response (200):**
```json
{
  "id": "product-123",
  "name": "Gaming Laptop",
  "description": "High-performance gaming laptop",
  "price": 1299.99,
  "category": "electronics",
  "isActive": true,
  "tenantId": "tenant-123",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Create Product

**POST /products**

**Authentication:** Required
**Authorization:** Requires 'admin' or 'manager' role

**Request Body:**
```json
{
  "name": "Gaming Laptop",
  "description": "High-performance gaming laptop with RTX 4080",
  "price": 1299.99,
  "category": "electronics",
  "specifications": {
    "cpu": "Intel i7-12700H",
    "gpu": "RTX 4080",
    "ram": "16GB DDR5"
  }
}
```

**Request Example:**
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-jwt-token>" \
  -d '{
    "name": "Gaming Laptop",
    "description": "High-performance gaming laptop",
    "price": 1299.99,
    "category": "electronics"
  }'
```

**Response (201):**
```json
{
  "id": "product-456",
  "name": "Gaming Laptop",
  "description": "High-performance gaming laptop",
  "price": 1299.99,
  "category": "electronics",
  "isActive": true,
  "tenantId": "tenant-123",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### Update Product

**PATCH /products/:id**

**Authentication:** Required
**Authorization:** Requires 'admin' or 'manager' role

**Request Body (partial):**
```json
{
  "name": "Updated Gaming Laptop",
  "price": 1199.99
}
```

**Request Example:**
```bash
curl -X PATCH http://localhost:3000/products/product-123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-jwt-token>" \
  -d '{
    "price": 1199.99
  }'
```

**Response (200):**
```json
{
  "id": "product-123",
  "name": "Gaming Laptop",
  "price": 1199.99,
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

### Delete Product

**DELETE /products/:id**

**Authentication:** Required
**Authorization:** Requires 'admin' role

**Request Example:**
```bash
curl -X DELETE http://localhost:3000/products/product-123 \
  -H "Authorization: Bearer <admin-jwt-token>"
```

**Response (204):** No content

## 🔒 Authentication API

### Login

Authenticate user and receive JWT token.

**POST /auth/login**

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

**Request Example:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePassword123!"
  }'
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "roles": ["user"],
    "tenantId": "tenant-123"
  },
  "expiresIn": 3600
}
```

### Refresh Token

**POST /auth/refresh**

**Request Body:**
```json
{
  "refreshToken": "refresh-token-here"
}
```

### Logout

**POST /auth/logout**

**Authentication:** Required

## 🏢 Multi-Tenancy

### Tenant Context

All authenticated requests automatically include tenant context. The API ensures data isolation between tenants.

**Tenant Resolution Methods:**

1. **JWT Claim**: Tenant ID from JWT token (recommended)
2. **Header**: `X-Tenant-ID` header
3. **Subdomain**: Extract from subdomain (e.g., `acme.yourdomain.com`)

### Tenant-Specific Endpoints

**GET /tenants/current**

Get current tenant information.

```bash
curl -X GET http://localhost:3000/tenants/current \
  -H "Authorization: Bearer <your-jwt-token>"
```

**Response:**
```json
{
  "id": "tenant-123",
  "name": "Acme Corporation",
  "subdomain": "acme",
  "isActive": true,
  "settings": {
    "timezone": "UTC",
    "currency": "USD"
  }
}
```

## 📡 WebSocket API

### Connection

Connect to WebSocket for real-time updates.

**Connection URL:** `ws://localhost:3000`

**Authentication:** Include JWT token in connection query:
```javascript
const socket = io('http://localhost:3000', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Events

**User Events:**
- `user:created` - New user created
- `user:updated` - User updated
- `user:deleted` - User deleted

**Product Events:**
- `product:created` - New product created
- `product:updated` - Product updated
- `product:deleted` - Product deleted

**Example Event Payload:**
```json
{
  "event": "user:created",
  "data": {
    "id": "user-123",
    "email": "new@example.com",
    "tenantId": "tenant-123"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## ❌ Error Handling

### HTTP Status Codes

- `200` - OK: Successful GET, PATCH
- `201` - Created: Successful POST
- `204` - No Content: Successful DELETE
- `400` - Bad Request: Validation errors
- `401` - Unauthorized: Missing or invalid authentication
- `403` - Forbidden: Insufficient permissions
- `404` - Not Found: Resource doesn't exist
- `409` - Conflict: Duplicate resource
- `422` - Unprocessable Entity: Business logic error
- `500` - Internal Server Error: Unexpected server error

### Common Error Scenarios

**Validation Error (400):**
```json
{
  "statusCode": 400,
  "message": [
    "email must be a valid email address",
    "password must be at least 6 characters long"
  ],
  "error": "Bad Request"
}
```

**Authentication Error (401):**
```json
{
  "statusCode": 401,
  "message": "Invalid or expired access token",
  "error": "Unauthorized"
}
```

**Authorization Error (403):**
```json
{
  "statusCode": 403,
  "message": "Insufficient permissions to access this resource",
  "error": "Forbidden"
}
```

**Not Found Error (404):**
```json
{
  "statusCode": 404,
  "message": "User with ID 'user-123' not found",
  "error": "Not Found"
}
```

## 📝 Request/Response Examples

### cURL Examples

**Create and retrieve a user:**
```bash
# 1. Create user
USER_RESPONSE=$(curl -s -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }')

# 2. Extract user ID
USER_ID=$(echo $USER_RESPONSE | jq -r '.id')

# 3. Get user by ID (requires authentication)
curl -X GET http://localhost:3000/users/$USER_ID \
  -H "Authorization: Bearer <your-jwt-token>"
```

### JavaScript/TypeScript Examples

**Using Fetch API:**
```typescript
// Create user
const createUser = async (userData: CreateUserDto) => {
  const response = await fetch('http://localhost:3000/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Get user with authentication
const getUser = async (userId: string, token: string) => {
  const response = await fetch(`http://localhost:3000/users/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return response.json();
};
```

**Using Axios:**
```typescript
import axios from 'axios';

// Configure axios instance
const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
});

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API calls
const userService = {
  createUser: (data: CreateUserDto) => api.post('/users', data),
  getUser: (id: string) => api.get(`/users/${id}`),
  updateUser: (id: string, data: UpdateUserDto) => api.patch(`/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/users/${id}`),
};
```

## 🔍 Rate Limiting

### Default Limits

- **Global**: 100 requests per minute per IP
- **Authentication**: 5 requests per minute per IP
- **Admin endpoints**: 50 requests per minute per user

### Rate Limit Headers

Response includes rate limit information:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642259400
```

### Rate Limit Exceeded (429)

```json
{
  "statusCode": 429,
  "message": "Too many requests, please try again later",
  "error": "Too Many Requests"
}
```

## 📊 API Versioning

### Current Version

All endpoints are currently version 1 (v1). Future versions will be available at:
- `http://localhost:3000/v2/users`
- `http://localhost:3000/v3/products`

### Version Headers

Include version in Accept header:
```bash
Accept: application/vnd.api+json;version=1
```

---

This API follows REST principles and provides consistent, predictable endpoints for all resources. For interactive testing, visit the Swagger UI at `http://localhost:3000/api/docs`.