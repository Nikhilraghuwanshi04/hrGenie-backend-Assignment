# Backend API Documentation

**Base URL**: `http://localhost:5001`

## Authentication
**Headers**: For protected routes, add `Authorization: Bearer <token>`

### 1. Signup
- **Endpoint**: `POST /api/auth/signup`
- **Body**:
  ```json
  {
    "username": "Left4Craft",
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: User object + Token

### 2. Login
- **Endpoint**: `POST /api/auth/login`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: User object + Token

## Documents

### 3. Create Document
- **Endpoint**: `POST /api/documents`
- **Auth**: Required
- **Body**:
  ```json
  {
    "title": "My New Doc",
    "_id": "optional-custom-id"
  }
  ```

### 4. Get Document
- **Endpoint**: `GET /api/documents/:id`
- **Auth**: Required
- **Response**: Document object (includes `data`, `title`)

## AI Features (Gemini)
*Note: Currently configured for Google Gemini. If using OpenAI key, these may fail.*

### 5. Grammar Check
- **Endpoint**: `POST /api/ai/grammar`
- **Auth**: Required
- **Body**: `{ "text": "Your text here" }`

### 6. Summarize
- **Endpoint**: `POST /api/ai/summarize`
- **Auth**: Required
- **Body**: `{ "text": "Long text to summarize..." }`

## Real-time (Socket.io)
**Connection URL**: `http://localhost:5001`

### Events
| Event Name | Direction | Payload | Description |
| :--- | :--- | :--- | :--- |
| `join-document` | Emit | `documentId` (string) | Join a doc room |
| `send-changes` | Emit | `delta` (object), `documentId` | Send text changes |
| `receive-changes` | Listen | `delta` (object) | Receive text changes |
| `cursor-changes` | Emit | `range` (object), `documentId` | Send cursor pos |
| `receive-cursor` | Listen | `range` (object), `userId` | Receive cursor pos |
| `save-document` | Emit | `{ documentId, content }` | Trigger DB save |
