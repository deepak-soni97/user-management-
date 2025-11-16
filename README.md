# NestJS User Management & Authentication

This repo is a complete NestJS project implementing a small **User Management & Authentication** API using MongoDB (Mongoose).

## Features
- Register / Login with JWT
- Protected routes (JWT Guard)
- Get users (admin-only), get profile, update profile, soft delete
- DTOs and Validation Pipes
- Response interceptor (uniform success format)
- Logger middleware
- Pagination & search on list users
- Profile picture upload (Multer, local)
- Basic unit test example (Jest)

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and update values
3. Install dependencies:
```bash
npm install
```
4. Run development server:
```bash
npm run start:dev
```

The server will start on `http://localhost:3000` by default.

## Endpoints

- `POST /auth/register` - body: `{ "name","email","password" }`
- `POST /auth/login` - body: `{ "email","password" }` -> returns `{ access_token }`
- `GET /users` - admin only, query: `page`, `limit`, `search`
- `GET /users/me` - get current user profile
- `PUT /users/me` - update profile `{ name?, password? }`
- `DELETE /users/me` - soft delete
- `POST /users/me/profile-picture` - form-data `file`

## Notes

- For testing admin routes, set `isAdmin` to true directly in the DB for a user.
- Uploads are saved to `uploads/` directory.
- Add more tests and role-based guards as needed.

