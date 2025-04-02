# Non-Profit Event Management Platform

A comprehensive platform designed to streamline volunteer coordination and event organization for non-profit organizations through intelligent admin controls and user-friendly interfaces.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Local Setup](#local-setup)
  - [Database Setup](#database-setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [User Roles](#user-roles)
- [API Endpoints](#api-endpoints)
- [Progressive Web App Features](#progressive-web-app-features)
- [Troubleshooting](#troubleshooting)

## Features

- **User Management**: Registration and authentication with role-based access control (Admin, Organizer, Volunteer)
- **Event Management**: Create, update, and track events with detailed information
- **Volunteer Coordination**: Assign and manage volunteers for specific events
- **Admin Controls**: Comprehensive admin dashboard for platform management
- **Progressive Web App Support**: Offline functionality and installable on mobile devices
- **Real-time Notifications**: WebSocket-based notification system
- **Responsive Design**: Mobile-first approach with full responsiveness across devices

## Technology Stack

- **Frontend**:
  - React with TypeScript
  - Tailwind CSS
  - Shadcn UI components
  - TanStack React Query for data fetching
  - PWA capabilities with service workers
  - WebSocket for real-time features

- **Backend**:
  - Express.js with TypeScript
  - PostgreSQL database
  - Drizzle ORM for database management
  - Passport.js for authentication
  - WebSocket server for notifications

## Prerequisites

Before setting up the project, ensure you have the following installed:

- Node.js (version 18.x or later)
- npm (version 8.x or later)
- PostgreSQL (version 14.x or later)
- Git

## Local Setup

### Database Setup

1. Install PostgreSQL if you haven't already:
   ```bash
   # For Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib

   # For macOS using Homebrew
   brew install postgresql
   ```

2. Create a new PostgreSQL database:
   ```bash
   sudo -u postgres psql
   ```

3. Inside the PostgreSQL shell, create a new database and user:
   ```sql
   CREATE DATABASE npo_event_platform;
   CREATE USER npo_user WITH ENCRYPTED PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE npo_event_platform TO npo_user;
   \q
   ```

### Backend Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd npo-event-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:
   ```
   DATABASE_URL=postgresql://npo_user:your_password@localhost:5432/npo_event_platform
   SESSION_SECRET=your_session_secret_key
   PORT=3000
   ```

4. Push the initial database schema:
   ```bash
   npm run db:push
   ```

### Frontend Setup

The frontend setup is included with the backend in this monorepo project.

1. Configure frontend environment (optional - only if needed):
   ```bash
   # Create a .env file in the client directory
   touch client/.env
   ```

2. Add any frontend-specific environment variables to this file (usually not needed):
   ```
   VITE_API_URL=http://localhost:3000
   ```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `SESSION_SECRET` | Secret key for session management | Yes |
| `PORT` | Port for the server to listen on | No (defaults to 3000) |
| `SENDGRID_API_KEY` | API key for SendGrid email service | No (only for email functionality) |

## Running the Application

1. Start the development server (both frontend and backend):
   ```bash
   npm run dev
   ```

2. The application will be available at:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:3000/api`

## Project Structure

```
├── client/                 # Frontend React application
│   ├── public/             # Static assets
│   ├── src/                # Source code
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and libraries
│   │   ├── pages/          # Application pages
│   │   └── ...             # Other frontend code
├── server/                 # Backend Express application
│   ├── auth.ts             # Authentication configuration
│   ├── cron.ts             # Scheduled tasks
│   ├── db.ts               # Database connection setup
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API routes
│   ├── services/           # Service modules
│   ├── storage.ts          # Data access layer
│   └── ...                 # Other backend code
├── shared/                 # Shared code between frontend and backend
│   ├── schema.ts           # Database schema and type definitions
├── drizzle.config.ts       # Drizzle ORM configuration
└── ...                     # Project configuration files
```

## User Roles

The platform supports three user roles:

1. **Admin**: Complete control over the platform, including user management and event approval
2. **Organizer**: Can create and manage events, invite volunteers, and track participation
3. **Volunteer**: Can browse events, register for volunteering, and track their commitments

## API Endpoints

The API follows RESTful conventions. Here are the main endpoints:

- **Authentication**:
  - `POST /api/register`: Register a new user
  - `POST /api/login`: Authenticate a user
  - `POST /api/logout`: End a user session
  - `GET /api/user`: Get current authenticated user

- **Events**:
  - `GET /api/events`: List all events
  - `POST /api/events`: Create a new event
  - `GET /api/events/:id`: Get details of a specific event
  - `PUT /api/events/:id`: Update an event
  - `DELETE /api/events/:id`: Delete an event

- **Volunteers**:
  - `POST /api/events/:id/register`: Register as a volunteer for an event
  - `GET /api/my-registrations`: Get user's volunteer registrations
  - `PUT /api/events/:id/volunteer/:userId`: Update volunteer status

- **Admin**:
  - `GET /api/admin/users`: List all users
  - `GET /api/admin/events`: List all events with management options
  - `POST /api/admin/events/:id/approve`: Approve an event

## Progressive Web App Features

The platform includes these PWA features:

- **Offline Access**: Core functionality works without an internet connection
- **Installation**: Can be installed on mobile devices and desktops
- **Push Notifications**: Receive updates about event changes and reminders
- **Responsive Design**: Optimized for all screen sizes and devices

## Troubleshooting

### Common Issues

1. **Database Connection Errors**:
   - Verify your PostgreSQL service is running
   - Check your `DATABASE_URL` environment variable
   - Ensure the database user has proper permissions

2. **Missing Node Modules**:
   - Run `npm install` to ensure all dependencies are installed

3. **Port Already in Use**:
   - Change the `PORT` environment variable
   - Check if another application is using the same port

4. **Authentication Issues**:
   - Ensure your `SESSION_SECRET` is properly set
   - Clear browser cookies if experiencing persistent login issues

For additional help, please check the issues section in the repository or contact the project maintainers.
