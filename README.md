# Reddit Clone - Mobile Forum Application

A full-stack Reddit-style forum built with React Native (Expo), Golang backend, and PostgreSQL database. Create posts, engage with comments, follow users, and build your community!

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Development Progress](#development-progress)
- [Testing](#testing)
- [Key Technologies Explained](#key-technologies-explained)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

A production-ready mobile forum application (Reddit clone) built as a technical assessment project. This demonstrates full-stack mobile development, RESTful API design, database management, and cloud deployment capabilities.

### Core Features

- User authentication (register/login with JWT)
- Create, read, update, delete posts
- Commenting system
- Image/media uploads and display
- Mobile-first design with React Native
- High-performance Golang backend
- Cloud-deployed on Railway

---

## Tech Stack

### Frontend

- **React Native** - Cross-platform mobile framework
- **Expo** - Development tooling and SDK
- **Expo Router** - File-based routing system
- **TypeScript** - Type-safe JavaScript
- **Axios** - HTTP client for API requests
- **AsyncStorage** - Local data persistence

### Backend

- **Golang** - High-performance backend language
- **Gin** - Fast HTTP web framework
- **GORM** - Object-relational mapping
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing

### Database

- **PostgreSQL** - Production database (via Neon)
- **Neon** - Serverless PostgreSQL hosting

### DevOps

- **Railway.app** - Backend hosting and deployment
- **Expo Go** - Mobile app testing and distribution
- **Docker** - Containerization support
- **Git** - Version control

---

## Features

### Authentication System

- User registration with validation
- Secure login with JWT tokens
- Password hashing with bcrypt
- Protected routes and middleware
- Token-based session management

### Post Management

- Create posts with title, content, and images
- Edit and delete own posts
- Upvote/downvote system
- Image upload and display
- Post feed with sorting

### Comment System

- Add comments to posts
- View all comments per post
- Edit/delete own comments
- Comment count tracking

### User Profiles

- Create user profiles
- User post history
- Profile information

### Social Features

- User discovery
- Activity tracking
- Engagement metrics

---

## Features Not Implemented 

### Authentication

Google OAuth Sign-In/Sign-Up - Only email/password authentication implemented
Apple OAuth Sign-In - OAuth infrastructure prepared but not completed
Social login persistence - No profile sync with OAuth providers

### Following Functionality, User Profiles & Social

Customized User Profile Pages - No dedicated profile view with user stats, bio, or post history display
Follow/Unfollow Users - Backend support exists but not integrated into frontend UI 
User Discovery - No "suggested users" or user recommendations
User Statistics - Follower count, following count, post count not displayed
Bio/Profile Customization - Users can't edit bio, location, or profile picture from app

### Communities

Join/Leave Communities - No community membership system
Community Pages - No dedicated community view or feed filtering by community
Community Moderation - No tools for community admins/moderators

### Search & Discovery

Search Users - Can only search posts, not users
Search Communities - Community search not implemented
Search History - No saved searches 

### Post Features

Rich Text Editor - Limited markdown support (basic formatting only)
Post Preview - No preview before publishing
Save Posts - No bookmark/save functionality

### Comment Features

Nested Replies - Comments don't support threaded replies
Comment Awards - No award system for comments

### Notifications & Real-time

Push Notifications - No notification system for upvotes, comments, follows
Activity Feed - No notification history or activity center
Mentions - Can't mention users with @username

### Content Moderation

Report/Flag Posts - No content reporting system
Block Users - Can't block users from contacting you
Content Filters - No NSFW or sensitive content warnings
Post Deletion Recovery - Deleted posts can't be recovered

---

## Project Structure

```
reddit-clone/
│
├── backend/                         # Golang REST API
│   ├── cmd/                         # Command-line tools
│   ├── internal/                    # Internal packages
│   │   ├── api/                     # API handlers
│   │   ├── models/                  # Database models
│   │   └── middleware/              # JWT auth middleware
│   ├── main.go                      # Server entry point
│   ├── go.mod                       # Go dependencies
│   ├── go.sum                       # Dependency checksums
│   ├── Dockerfile                   # Docker configuration
│   ├── docker-compose.yml           # Multi-container setup
│   ├── env.example                  # Environment variables template
│   ├── fly.toml                     # Fly.io deployment config
│   └── README.md                    # Backend documentation
│
└── expo-app/                        # React Native mobile app
    ├── app/                         # Expo Router screens
    │   ├── (tabs)/                  # Bottom tab navigation
    │   │   ├── _layout.tsx          # Tab layout configuration
    │   │   ├── index.tsx            # Home/Feed screen
    │   │   ├── chat.tsx             # Chat screen (placeholder)
    │   │   ├── communities.tsx      # Communities screen
    │   │   ├── create.tsx           # Create post screen
    │   │   └── inbox.tsx            # Inbox/notifications
    │   ├── post/                     # Post-related screens
    │   │   └── [id].tsx             # Post detail layout
    │   ├── assets/                   # App assets
    │   │   ├── data/                 # Dummy data
    │   │   └── images/               # Image files
    │   ├── components/               # Reusable components
    │   │   └── ui/                   # UI component library
    │   │       ├── PostListItem.tsx  # Post card component
    │   │       ├── CommentListItem.tsx # Comment component
    │   │       ├── themed-text.tsx   # Themed text wrapper
    │   │       └── themed-view.tsx   # Themed view wrapper
    │   ├── constants/                # App constants
    │   ├── hooks/                    # Custom React hooks
    │   ├── types/                    # TypeScript definitions
    │   ├── groupSelector.tsx         # Group selection UI
    │   └── modal.tsx                 # Modal screen template
    │
    ├── assets/                        # Root-level assets
    │   └── icon.png                  # App icon
    │
    ├── app.json                       # Expo configuration
    ├── package.json                   # npm dependencies
    ├── tsconfig.json                  # TypeScript config
    ├── eslint.config.js               # ESLint rules
    ├── global.d.ts                    # Global type definitions
    ├── expo-env.d.ts                  # Expo environment types
    └── README.md                      # Documentation
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Go](https://golang.org/dl/) (v1.21+)
- PostgreSQL - Local install or use [Neon](https://neon.tech)
- Expo Go app - [iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
- [Git](https://git-scm.com/downloads)

### Backend Setup

```bash
# Clone repository
git clone https://github.com/emilythestrangee/reddit-clone.git
cd reddit-clone/backend

# Install dependencies
go mod download

# Set up environment variables
cp env.example .env
# Edit .env with your database credentials

# Run migrations (if applicable)
# go run cmd/migrate/main.go

# Start the server
go run cmd/api/main.go

# Server runs at http://localhost:8080 or http://<your-ip-address>:8080
```

### Frontend Setup

```bash
# Navigate to mobile app
cd ../expo-app

# Install dependencies
npm install

# Update backend API URL in services/api.ts
# Change: const API_URL = 'http://localhost:8080/api' or use Railway URL if deployed= 'https://your-backend.railway.app/api'

# Start Expo development server
npx expo start

# Options:
# - Press 'a' for Android emulator
# - Press 'i' for iOS simulator (Mac only)
# - Scan QR code with Expo Go app on your phone
# - Press 'w' to open in web browser
```

### Database Setup (Neon)

1. Create a free account at [Neon.tech](https://neon.tech)
2. Create a new PostgreSQL database
3. Copy the connection string from Neon dashboard

**Option 1: Using DATABASE_URL (Simpler)**
```env
DATABASE_URL=postgresql://neondb_owner:your-password@ep-wild-grass-xxxx.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**Option 2: Using Individual Environment Variables (Recommended for this project)**
```env
DB_HOST=ep-wild-grass-xxxx.c-3.us-east-1.aws.neon.tech
DB_PORT=5432
DB_USER=neondb_owner
DB_PASSWORD=your-password
DB_NAME=neondb
DB_SSLMODE=require
```

4. Add your chosen option to `backend/.env`
5. Backend will auto-migrate tables on startup

---

## API Endpoints

**Base URL:** `http://localhost:8080/api` or `http://<your-ip-address>:8080/api` (development) or your Railway URL (production)

### Authentication

```
POST   /api/register          # Create new user
POST   /api/login             # Login user (returns JWT token)
```

### Posts

```
GET    /api/posts             # Get all posts
POST   /api/posts             # Create post (auth required)
GET    /api/posts/:id         # Get single post
PUT    /api/posts/:id         # Update post (auth required)
DELETE /api/posts/:id         # Delete post (auth required)
POST   /api/posts/:id/vote    # Upvote/downvote (auth required)
```

### Comments

```
GET    /api/posts/:id/comments        # Get post comments
POST   /api/posts/:id/comments        # Add comment (auth required)
PUT    /api/comments/:id              # Update comment (auth required)
DELETE /api/comments/:id              # Delete comment (auth required)
```

### Users

```
GET    /api/users/:id                 # Get user profile
PUT    /api/users/:id                 # Update profile (auth required)
POST   /api/users/:id/follow          # Follow user (auth required)
DELETE /api/users/:id/follow          # Unfollow user (auth required)
GET    /api/users/:id/followers       # Get followers list
GET    /api/users/:id/following       # Get following list
```

**Protected Routes:** Require `Authorization: Bearer <JWT_TOKEN>` header

---

## Deployment

### Backend (Railway)

#### 1. Create Railway Account

Sign up at [Railway.app](https://railway.app)

#### 2. Connect your GitHub repository

#### 3. Deploy Backend

```bash
# Railway will auto-detect your Dockerfile
# Or use railway.json for configuration
```

#### 4. Configure Database

- Add PostgreSQL plugin in Railway dashboard
- Railway auto-injects `DATABASE_URL` environment variable

#### 5. Environment Variables

```env
DATABASE_URL=<auto-injected-by-railway>
JWT_SECRET=<your-secret-key>
PORT=8080
```

#### 6. Domain

Railway provides: `https://your-app.railway.app`

Update frontend API URL to point to this domain



### Frontend (Expo)

#### Development Testing

```bash
npx expo start
# Share via Expo Go app
```

#### Production Build (optional)

```bash
# For app stores
eas build --platform android
eas build --platform ios
```

---

## Development Progress

### Completed

- Backend API with all CRUD endpoints
- PostgreSQL database integration with GORM
- JWT authentication and middleware
- User registration and login
- Post creation, editing, deletion
- Comment system
- Frontend screens (Feed, Create)
- React Navigation with Expo Router
- API service layer with Axios
- Image upload functionality
- Upvote/downvote system
- Deployed backend on Railway
- Environment configuration
- Dark mode support
- UI/UX polish and refinements
- Enhanced error handling
- Loading states and real-time notifications

### Future Enhancements

- Search functionality
- Content moderation tools
- Push notifications
- Image optimization
- Pagination for feeds
- User settings page
- Report/block users

---

## Testing

### Backend Testing

```bash
# Run tests
cd backend
go run cmd/api/main.go

# Test with curl
curl -X POST http://localhost:8080/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password123"}'
```

### API Testing with Postman

Import the collection and test all endpoints:

**Example: Create Post**

```
POST http://localhost:8080/api/posts
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "My First Post",
  "content": "Hello Reddit Clone!",
  "image": ""
}
```

---

## Key Technologies Explained

### Why Golang?

- High performance and concurrency
- Fast compilation and execution
- Strong standard library
- Excellent for RESTful APIs
- Native Docker support

### Why React Native + Expo?

- Cross-platform (iOS + Android)
- Write once, deploy everywhere
- Large ecosystem and community
- Fast development with hot reload
- Easy deployment with Expo Go

### Why PostgreSQL?

- Robust relational database
- ACID compliance
- Strong data integrity
- Excellent performance
- Neon provides serverless hosting

### Why Railway?

- Simple deployment process
- Auto-scaling capabilities
- Built-in PostgreSQL support
- Environment management
- GitHub integration

---

## Tech Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React Native + Expo | Mobile UI |
| **Language** | TypeScript | Type safety |
| **Navigation** | Expo Router | Screen routing |
| **HTTP Client** | Axios | API requests |
| **Backend** | Golang + Gin | REST API |
| **Database** | PostgreSQL (Hosted on Neon) | Data storage |
| **ORM** | GORM | Database operations |
| **Auth** | JWT + bcrypt | Security |
| **Hosting** | Railway | Cloud deployment |
| **Version Control** | Git + GitHub | Code management |

---

## Contributing

This is a technical assessment project. Feedback and suggestions are welcome!

---

## License

Educational project for technical assessment purposes.

---

## Links

- **Preview URL (View in mobile after installing Expo Go):** [https://bit.ly/Reddit-clone ](https://bit.ly/Reddit-clone)
- **Repository:** [github.com/emilythestrangee/reddit-clone](https://github.com/emilythestrangee/reddit-clone)
- **Backend API:** [https://backend-green-fog-6124-production.up.railway.app/api](https://backend-green-fog-6124-production.up.railway.app/api)
- **Mobile App:** Available via Expo Go
- **Documentation:** See individual README files in `/backend`

## Demo

https://github.com/user-attachments/assets/fac425f9-67e3-48cb-99db-9e2eee5dfb74
