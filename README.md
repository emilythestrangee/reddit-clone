# 🚀 Reddit Clone - Mobile Forum Application (Work In Progress)

> A full-stack Reddit-style forum built with **React Native (Expo)** and **Golang** backend. Create posts, engage with comments, follow users, and build your community!

---

## 📋 Table of Contents
- [Project Overview](#-project-overview)
- [Tech Stack](#-tech-stack)
- [Current Status](#-current-status)
- [Features](#-features)
- [Development Timeline](#-development-timeline)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Learning Resources](#-learning-resources)

---

## 🎯 Project Overview

Building a production-ready mobile forum application (Reddit clone) from scratch as part of a technical assessment. This project demonstrates full-stack development capabilities, API design, mobile app architecture, and deployment skills within a **2-week timeline**.

**Core Requirements:**
- User authentication (register/login)
- Create, read, update, delete posts
- Commenting system
- Image uploads
- User profiles with follow/unfollow
- Mobile-first design with React Native
- RESTful API backend in Golang
- Production deployment

---

## 🛠 Tech Stack

### **Frontend**
- **React Native** - Cross-platform mobile development
- **Expo** - Development framework and tooling
- **Expo Router** / **React Navigation** - Screen navigation
- **Axios** - HTTP client for API calls
- **AsyncStorage** - Local data persistence & auth tokens
- **Expo Image Picker** - Native image selection
- **React Hooks** - `useState`, `useEffect`, `useContext`

### **Backend**
- **Golang** - High-performance backend language
- **Gin** - Web framework for RESTful APIs
- **GORM** - ORM for database operations
- **SQLite** - Lightweight database (development)
- **JWT** - Token-based authentication (planned)
- **bcrypt** - Password hashing (planned)

### **DevOps & Deployment**
- **Railway.app** - Backend hosting
- **Expo Go** - Mobile app distribution for testing
- **GitHub** - Version control and collaboration

---

## 🔄 Tech Stack Decisions

| Feature | Other Applications | Our Application | Why |
|---------|--------------|-------------|-----|
| **Backend** | Supabase | Custom Golang API | Project requirement |
| **Authentication** | Clerk | Custom JWT auth | Full control & learning |
| **State Management** | Jotai | React Context/Hooks | Simpler, sufficient for our needs |
| **Data Fetching** | TanStack Query | Axios + useEffect | Direct API calls, less abstraction |
| **Database** | Supabase PostgreSQL | SQLite → PostgreSQL | Progressive complexity |
| **Storage** | Supabase Storage | Custom file upload API | Integrated with our backend |

**Our Approach:**
- **Learning from resources** - UI/UX patterns, component structure, navigation flows
- **Building custom backend** - Full ownership of API design and data flow
- **Simplified stack** - Using proven, straightforward technologies
- **Production-ready** - Deployable, scalable architecture

---

## 📊 Current Status

### **Completed (Week 1 - Days 1-2)**
- [x] Project structure setup (monorepo)
- [x] Backend API with all core endpoints (15 routes)
- [x] Database models (Users, Posts, Comments, Follows)
- [x] CORS configuration for mobile
- [x] Git repository initialized
- [x] Backend tested with Postman
- [x] SQLite database with migrations

### **In Progress (Week 1 - Days 3-4)**
- [ ] Frontend screens (Login, Register, Feed)
- [ ] React Navigation setup
- [ ] API service layer (Axios integration)
- [ ] Authentication flow with token storage

### **Upcoming (Week 1 - Days 5-7)**
- [ ] Create post screen with image picker
- [ ] Post detail screen with comments
- [ ] User profile screens
- [ ] Follow/unfollow functionality

### **Week 2**
- [ ] Polish UI/UX
- [ ] Implement JWT authentication
- [ ] Deploy backend 
- [ ] Create shareable Expo link
- [ ] Final testing and documentation

---

## ✨ Features

### **Authentication** 
- User registration with email validation
- Secure login system
- Token-based session management
- Persistent authentication state
- Logout functionality

### **Posts** 
- Create posts with title, content, and images
- Edit and delete own posts
- Upvote/downvote system
- Chronological feed display
- Image attachments via native picker

### **Comments** 
- Comment on any post
- View all comments per post
- Edit/delete own comments
- Real-time comment counts
- User attribution for each comment

### **User Profiles** 
- View user profiles with post history
- Follow/unfollow users
- Follower and following counts
- Edit profile information
- View followed users' posts

### **Social Features** 
- Personalized feed based on follows
- Discover new users
- Community engagement metrics
- Vote tracking per user

---

## 📅 Development Timeline

```
Week 1 (Jan 21-27)
├── Days 1-2: Backend foundation ✅
│   ├── Go server setup ✅
│   ├── Database models ✅
│   ├── All API endpoints ✅
│   └── Postman testing ✅
│
├── Days 3-4: Frontend setup & auth 
│   ├── Expo project init ✅
│   ├── Navigation structure
│   ├── Login/Register screens
│   └── API service layer
│
├── Days 5-6: Core features
│   ├── Feed screen
│   ├── Create post screen
│   ├── Post detail with comments
│   └── Image upload integration
│
└── Day 7: Social features
    ├── User profiles
    ├── Follow system
    └── Profile editing

Week 2 (Jan 28 - Feb 4)
├── Days 8-10: Polish & enhancements
│   ├── UI/UX improvements
│   ├── Loading states
│   ├── Error handling
│   └── Optimistic updates
│
├── Days 11-12: Deployment
│   ├── Backend to Railway ☁️
│   ├── Environment config
│   ├── Production testing
│   └── Expo build
│
└── Days 13-14: Final touches
    ├── Bug fixes
    ├── Documentation
    ├── Demo preparation
    └── Submission
```

---

## 📁 Project Structure

```
reddit-clone/
├── assets/                     # Root level assets
│   └── icon.png
│
├── backend/                    # Golang REST API
│   ├── main.go                # Server entry point
│   ├── go.mod                 # Go dependencies
│   └── go.sum                 # Dependency checksums
│
└── expo-app/                   # React Native mobile app (TypeScript)
    ├── app/                   # Expo Router screens
    │   ├── (tabs)/           # Tab navigation
    │   │   ├── _layout.tsx   # Tab layout
    │   │   ├── index.tsx     # Home/Feed screen
    │   │   ├── chat.tsx      # Chat screen
    │   │   ├── communities.tsx # Communities screen
    │   │   ├── create.tsx    # Create post screen
    │   │   └── inbox.tsx     # Inbox screen
    │   │
    │   ├── post/             # Post detail screens
    │   │   └── _layout.tsx
    │   │
    │   ├── assets/           # App assets
    │   │   └── images/       # Image files
    │   │
    │   ├── components/       # Reusable components
    │   │   └── ui/          # UI components
    │   │       ├── PostListItem.tsx
    │   │       ├── CommentListItem.tsx
    │   │       ├── themed-text.tsx
    │   │       └── themed-view.tsx
    │   │
    │   ├── constants/        # App constants
    │   ├── hooks/            # Custom React hooks
    │   ├── types/            # TypeScript type definitions
    │   │
    │   ├── groupSelector.tsx # Group selector screen
    │   └── modal.tsx         # Modal screen
    │
    ├── app.json              # Expo configuration
    ├── package.json          # npm dependencies
    ├── tsconfig.json         # TypeScript configuration
    |── README.md
    └── eslint.config.js      # ESLint rules
---

## 🚀 Getting Started

### **Prerequisites**
- **Node.js** (v18+) - [Download](https://nodejs.org/)
- **Go** (v1.21+) - [Download](https://go.dev/dl/)
- **Expo Go** app on your phone - [iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **Postman** (for API testing) - [Download](https://www.postman.com/downloads/)
- **Git** - [Download](https://git-scm.com/)

### **Backend Setup**

```bash
# Clone repository
git clone https://github.com/emilythestrangee/reddit-clone.git
cd reddit-clone

# Navigate to backend
cd backend

# Install dependencies
go mod tidy

# Run server
go run main.go

# Server runs at http://localhost:8080
# You should see: "🚀 Server starting on http://localhost:8080"
```

### **Frontend Setup**

```bash
# Navigate to frontend (from project root)
cd expo-app

# Install dependencies
npm install

# Start Expo development server
npx expo start

# Options:
# - Press 'w' to open in web browser
# - Scan QR code with Expo Go app (iOS/Android)
# - Press 'a' for Android emulator
# - Press 'i' for iOS simulator (Mac only)
```

### **Testing the Backend**

Import this Postman collection or test manually:

**1. Register User**
```bash
POST http://localhost:8080/api/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

**2. Login**
```bash
POST http://localhost:8080/api/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}

# Copy the token from response
```

**3. Create Post (Protected)**
```bash
POST http://localhost:8080/api/posts
Authorization: Bearer your-token-here
Content-Type: application/json

{
  "title": "My First Post",
  "content": "Hello Reddit Clone!",
  "image": ""
}
```

**4. Get All Posts**
```bash
GET http://localhost:8080/api/posts
```

---

## 📡 API Endpoints

### **Authentication**
```
POST   /api/register          # Create new user
POST   /api/login             # Login user (returns token)
```

### **Posts**
```
GET    /api/posts             # Get all posts (public)
POST   /api/posts             # Create post (auth required)
PUT    /api/posts/:id         # Update post (auth required)
DELETE /api/posts/:id         # Delete post (auth required)
POST   /api/posts/:id/vote    # Upvote/downvote (auth required)
```

### **Comments**
```
GET    /api/posts/:id/comments        # Get post comments (public)
POST   /api/posts/:id/comments        # Add comment (auth required)
```

### **Users**
```
GET    /api/users/:id                 # Get user profile (public)
PUT    /api/users/:id                 # Update profile (auth required)
POST   /api/users/:id/follow          # Follow user (auth required)
DELETE /api/users/:id/follow          # Unfollow user (auth required)
GET    /api/users/:id/followers       # Get followers list (public)
GET    /api/users/:id/following       # Get following list (public)
```

**Protected Routes:** Require `Authorization: Bearer <token>` header

---

## 📚 Learning Resources

### **Official Documentation**
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Gin Web Framework](https://gin-gonic.com/)
- [GORM ORM](https://gorm.io/)
- [React Native Docs](https://reactnative.dev/)

---

## 🎓 What We're Learning

This project covers comprehensive full-stack mobile development:

### **Frontend Skills**
- **React Native fundamentals** - Components, state, props, hooks
- **Mobile UI/UX** - Native design patterns and interactions
- **Navigation** - Stack and tab navigation patterns
- **Styling** - React Native StyleSheet and layouts
- **Native APIs** - Image picker, camera, storage
- **State management** - Context API and custom hooks
- **API integration** - Axios for HTTP requests
- **Local storage** - AsyncStorage for persistence

### **Backend Skills**
- **Golang** - Language fundamentals and best practices
- **RESTful API design** - Resource-based endpoints
- **Database modeling** - Relational data structures with GORM
- **Authentication** - JWT tokens and middleware
- **CRUD operations** - Full data lifecycle management
- **Database relationships** - Foreign keys and associations
- **Performance** - Efficient queries and data loading
- **Security** - CORS, input validation, password hashing

### **DevOps & Tools**
- **Deployment** - Railway for backend hosting
- **Mobile distribution** - Expo Go for testing
- **API testing** - Postman workflows and collections
- **Version control** - Git workflow and collaboration
- **Project structure** - Monorepo organization

---

## 🎯 Key Differences from Tutorials

| Aspect | Other Approaches | Our Approach | Rationale |
|--------|------------------|--------------|-----------|
| **Backend** | Supabase (BaaS) | Custom Golang API | Project requirement, full control |
| **Auth** | Clerk (3rd party) | Custom JWT | Learning opportunity |
| **State** | Jotai | React Context/Hooks | Simpler for our scale |
| **Data Fetching** | TanStack Query | Axios + useEffect | Direct control over API calls |
| **Database** | Supabase PostgreSQL | SQLite → PostgreSQL | Progressive migration |
| **File Upload** | Supabase Storage | Custom endpoint | Integrated backend logic |

---

## 📝 Development Notes

### **Architecture Decisions**
- **Monorepo structure** - Easier development, single source of truth
- **API-first approach** - Backend complete before UI integration
- **SQLite for development** - Fast iteration, will migrate to PostgreSQL
- **Mock auth initially** - Functional first, secure later
- **CORS enabled** - Configured for mobile app access
- **Modular organization** - Separate screens, components, services

### **Current Limitations (MVP)**
- Mock JWT tokens (functional auth, not production-secure yet)
- SQLite database (will migrate to PostgreSQL for production)
- Basic error handling (will enhance with better UX)
- No real-time features (can add with WebSockets later)

### **Post-MVP Enhancements**
- Proper JWT with refresh tokens
- PostgreSQL migration for production
- Real-time notifications
- Search functionality
- Content moderation
- Dark mode support
- Push notifications
- Analytics dashboard
- Image compression and optimization
- Pagination for large datasets

---

## 🐛 Known Issues & Limitations

- [ ] Authentication uses mock tokens (not production-ready)
- [ ] No password hashing yet (will implement bcrypt)
- [ ] Limited error messages on frontend
- [ ] No loading states yet
- [ ] Image upload stores base64 (will optimize)

---

## 🤝 Contributing

This is a learning project for technical assessment. Feedback welcome but no external contributions accepted during assessment period.

---

## 📄 License

Educational project for technical assessment purposes.

---

## 🔗 Links

- **Repository:** [github.com/emilythestrangee/reddit-clone](https://github.com/emilythestrangee/reddit-clone)
- **Backend API:** Coming soon 
- **Mobile App:** Coming soon 
- **Demo Video:** Coming soon

---
