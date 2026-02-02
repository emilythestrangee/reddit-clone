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
- Nested commenting system
- Image uploads and display
- User profiles with follow/unfollow functionality
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
- Nested comment threads
- Comment count tracking

### User Profiles

- View user profiles
- Follow/unfollow users
- Follower and following counts
- User post history
- Profile information

### Social Features

- Personalized feed
- User discovery
- Activity tracking
- Engagement metrics

---

## Project Structure

```
reddit-clone/
│
├── backend/                        # Golang REST API
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
go run main.go

# Server runs at http://localhost:8080
```

### Frontend Setup

```bash
# Navigate to mobile app
cd ../expo-app

# Install dependencies
npm install

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
3. Copy the connection string
4. Add to your backend `.env` file:

```env
DATABASE_URL=postgresql://username:password@host/database
```

---

## API Endpoints

**Base URL:** `http://localhost:8080/api` (development) or your Railway URL (production)

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

- [x] Backend API with all CRUD endpoints
- [x] PostgreSQL database integration with GORM
- [x] JWT authentication and middleware
- [x] User registration and login
- [x] Post creation, editing, deletion
- [x] Comment system
- [x] Frontend screens (Feed, Create)
- [x] React Navigation with Expo Router
- [x] API service layer with Axios
- [x] Image upload functionality
- [x] Upvote/downvote system
- [x] Deployed backend on Railway
- [x] Environment configuration
- [x] Dark mode support

### In Progress

- [ ] UI/UX polish and refinements
- [ ] Enhanced error handling
- [ ] Loading states and animations
- [ ] Real-time notifications

### Future Enhancements

- [ ] Search functionality
- [ ] Content moderation tools
- [ ] Push notifications
- [ ] Image optimization
- [ ] Pagination for feeds
- [ ] User settings page
- [ ] Report/block users

---

## Testing

### Backend Testing

```bash
# Run tests
cd backend
go test ./...

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
| **Database** | PostgreSQL (Neon) | Data storage |
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

- **Repository:** [github.com/emilythestrangee/reddit-clone](https://github.com/emilythestrangee/reddit-clone)
- **Backend API:** Deployed on Railway
- **Mobile App:** Available via Expo Go
- **Documentation:** See individual README files in `/backend`
- **Demo Video:** [Coming Soon]