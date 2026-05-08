# Team Task Manager

A professional, full-stack team task management application built with the MERN stack. Features a modern SaaS-style UI, real-time-like updates, Kanban boards, and comprehensive analytics.

## 🚀 Features

- **Robust Authentication**: Secure JWT-based auth with bcrypt password hashing.
- **Role-Based Access Control (RBAC)**: Admin and Member roles with strict permission enforcement.
- **Project Management**: Create, update, and manage projects with dedicated team members.
- **Kanban Task Board**: Drag-and-drop task management within projects.
- **Global Task Overview**: Filterable and searchable global task list.
- **Analytics Dashboard**: Visual data representation using Recharts (Pie & Bar charts).
- **Activity Logging**: Track important changes across the application.
- **Premium UI/UX**: Responsive design, skeleton loaders, toast notifications, and smooth animations.

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Framer Motion, Lucide React, Axios, Recharts, React Router 6.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB with Mongoose.
- **Auth**: JSON Web Tokens (JWT), Bcrypt.js.

## 📦 Installation

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository
```bash
git clone <repository-url>
cd team-task-project
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```
Update `.env` with your `MONGODB_URI` and `JWT_SECRET`.

### 3. Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env
```
Update `.env` with `VITE_API_URL=http://localhost:5000/api`.

### 4. Run Locally
**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

## 🚆 Railway Deployment

### Backend
1. Connect your repo to Railway.
2. Set root directory to `backend`.
3. Add Environment Variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL` (your frontend deployment URL)
   - `NODE_ENV=production`

### Frontend
1. Connect your repo to Railway as a separate service.
2. Set root directory to `frontend`.
3. Add Environment Variable:
   - `VITE_API_URL` (your backend deployment URL + /api)
4. Build Command: `npm run build`
5. Start Command: `npx serve -s dist`

## 📄 API Documentation

### Auth
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get all user projects
- `POST /api/projects` - Create project (Admin)
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project (Admin)
- `DELETE /api/projects/:id` - Delete project (Admin)
- `POST /api/projects/:id/members` - Add members (Admin)

### Tasks
- `GET /api/tasks` - Get tasks with filters
- `POST /api/tasks` - Create task (Admin)
- `PUT /api/tasks/:id` - Update task status (Member) or full task (Admin)
- `DELETE /api/tasks/:id` - Delete task (Admin)

### Dashboard
- `GET /api/dashboard/stats` - Get analytics stats

---
Built with ❤️ for Team Productivity.
