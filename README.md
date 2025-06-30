# Backend - Todo Task Management App

This is the backend for the full-stack Todo Task Management App built with Node.js, Express, and MongoDB.

## Features
- User Registration & Login (Email/Password)
- Social Login (Google, GitHub)
- JWT Authentication
- Task CRUD Operations
- Task Sharing via Email
- Task Filtering by Priority
- Task Completion Toggle
- Real-time Task Sync (Socket.IO)

## Technologies
- Node.js
- Express
- MongoDB & Mongoose
- Passport.js (Google, GitHub)
- JWT
- Socket.IO
- dotenv
- bcryptjs
- CORS

## Run Locally
```bash
npm install
npm run dev
```

Runs on: `http://localhost:5000`

Create a `.env` file in the root and add the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

Make sure MongoDB is running locally or provide an Atlas URI. Social login requires you to configure the Google and GitHub developer credentials properly in your `.env` file.
