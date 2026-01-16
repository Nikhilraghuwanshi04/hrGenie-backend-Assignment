# Collaborative Editor Backend

## Overview
This is the backend service for a real-time collaborative document editor. It provides APIs for user authentication, document management, and AI-powered features (grammar checking and summarization). It utilizes **Socket.IO** for real-time bidirectional communication, enabling multiple users to edit documents simultaneously.

## Features
- **Real-time Collaboration**: Multiple users can edit the same document concurrently with immediate updates.
- **User Presence**: See who is currently viewing or editing a document.
- **Authentication**: Secure signup and login using JWT (JSON Web Tokens).
- **Document Management**: Create, read, update, and delete documents.
- **AI Assistance**: Integrated grammar checking and text summarization using OpenAI's GPT models.
- **Scalable Architecture**: Built with Node.js, Express, and MongoDB.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (with Mongoose ODM)
- **Real-time Engine**: Socket.IO
- **AI Integration**: OpenAI API
- **Authentication**: JWT, bcryptjs

## Architecture

The application follows a modular architecture separating concerns into routes, controllers, services, and models.

### Core Components
1.  **Entry Point (`src/server.ts`)**:
    - Initializes the HTTP server and the Socket.IO server.
    - Connects to the MongoDB database.
    - Listens on the configured port.

2.  **App Configuration (`src/app.ts`)**:
    - Sets up the Express application.
    - Configures middleware:
        - `cors`: Handles Cross-Origin Resource Sharing.
        - `helmet`: Adds security headers.
        - `express.json()`: Parses incoming JSON requests.
        - `rateLimit`: Protects against brute-force attacks.
    - Mounts API routes (`/api/auth`, `/api/documents`, `/api/ai`).

3.  **Data Layer (`src/models`)**:
    - Defines the schema for data persistence using Mongoose.
    - **User**: Stores user credentials (hashed passwords) and profiles.
    - **Document**: Stores document content (`data`), owner, and metadata.

4.  **Service Layer (`src/services`)**:
    - **Socket Service (`socketService.ts`)**:
        - Manages real-time WebSocket connections.
        - Handles events like `join-document`, `send-changes` (text updates), `cursor-changes`, and `save-document`.
        - Manages "rooms" for each document to broadcast changes only to relevant users.
    - **AI Service (`aiService.ts`)**:
        - Wraps the OpenAI API interactions.
        - Provides functions for `checkGrammar` and `summarizeText`.

5.  **API Layer (`src/routes` & `src/controllers`)**:
    - **Auth**: `POST /signup`, `POST /login` (returns JWT).
    - **Documents**: `GET /`, `POST /`, `GET /:id`, `PUT /:id`, `DELETE /:id`.
    - **AI**: `POST /grammar-check`, `POST /summarize`.

### Data Flow for Real-time Editing
1.  Client connects via Socket.IO and emits `join-document`.
2.  Server adds the socket to a specific "room" (document ID).
3.  When a user types, client emits `send-changes`.
4.  Server broadcasts `receive-changes` to all other sockets in that room.
5.  Changes are applied on clients to keep the view synchronized.
6.  Periodic or manual saves trigger `save-document`, persisting the current state to MongoDB.

## Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas URI)

### Steps
1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd assignment-backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and add the following:
    ```env
    PORT=5000
    MONGODB_URL=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    OPENAI_API_KEY=your_openai_api_key
    # Optional fallback if OPENAI_API_KEY is not set
    GEMINI_API_KEY=your_openai_api_key
    ```

4.  **Run the application (Development):**
    ```bash
    npm run dev
    ```
    The server will start (default: `http://localhost:5000`).

5.  **Build for Production:**
    ```bash
    npm run build
    npm start
    ```

## API Endpoints

### Authentication
- `POST /api/auth/signup`: Create a new user account.
- `POST /api/auth/login`: Login and receive an access token.

### Documents
- `GET /api/documents`: List all documents.
- `POST /api/documents`: Create a new document.
- `GET /api/documents/:id`: Get a specific document.
- `DELETE /api/documents/:id`: Delete a document.

### AI Features
- `POST /api/ai/grammar-check`: Check text for grammar errors.
- `POST /api/ai/summarize`: Generate a summary of the provided text.

## Scripts
- `npm run dev`: Runs the app in development mode with `nodemon`.
- `npm run build`: Compiles TypeScript to JavaScript.
- `npm start`: Runs the compiled code from `dist/server.js`.
