# Smart Social Media Assistant

## Overview
A smart assistant application that helps users manage and automate social media posting across multiple platforms (X/Twitter, Facebook, Instagram, Threads, LinkedIn). Uses AI (Gemini API) to generate engaging content based on user preferences and automatically publishes posts on a schedule.

## Recent Changes (October 3, 2025)
- Set up complete Python (FastAPI) backend and React (Vite) frontend
- Installed all dependencies for both frontend and backend
- Configured PostgreSQL database integration
- Fixed Tailwind CSS v4 PostCSS configuration
- Created startup scripts for development and production
- Configured Replit environment with proper port settings
- Set up deployment configuration for autoscale

## Technology Stack

### Backend
- **Framework**: FastAPI (Python 3.11)
- **Database**: PostgreSQL (Replit Database)
- **ORM**: SQLAlchemy
- **Authentication**: JWT tokens with python-jose
- **Password Hashing**: passlib with bcrypt
- **AI Integration**: Google Gemini API (google-generativeai)
- **Server**: Uvicorn with auto-reload

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4 with @tailwindcss/postcss
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **UI Components**: lucide-react icons, react-calendar

## Project Structure
```
.
├── backend/
│   └── app/
│       ├── routers/          # API endpoint routes
│       │   ├── auth.py       # Authentication endpoints
│       │   ├── users.py      # User management
│       │   ├── social_accounts.py  # Social media account management
│       │   ├── preferences.py      # User content preferences
│       │   ├── content.py    # AI content generation
│       │   └── posts.py      # Post management
│       ├── main.py           # FastAPI app entry point
│       ├── config.py         # Configuration and settings
│       ├── database.py       # Database connection
│       ├── models.py         # SQLAlchemy models
│       ├── schemas.py        # Pydantic schemas
│       └── auth.py           # Authentication utilities
├── frontend/
│   ├── src/
│   │   ├── pages/            # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── GenerateContent.jsx
│   │   │   ├── Posts.jsx
│   │   │   ├── Calendar.jsx
│   │   │   └── Preferences.jsx
│   │   ├── components/       # Reusable components
│   │   ├── context/          # React context providers
│   │   └── services/         # API service layer
│   ├── vite.config.js
│   └── package.json
├── requirements.txt          # Python dependencies
├── start_app.sh             # Development startup script
└── start_backend.sh         # Backend-only startup script
```

## Environment Variables Required

### Backend (Already Configured)
- `DATABASE_URL` - PostgreSQL connection string (auto-configured by Replit)
- `SESSION_SECRET` - JWT secret key for authentication (configured)
- `GEMINI_API_KEY` - Google Gemini API key (REQUIRED - needs to be set by user)

### Frontend
- `VITE_API_URL` - Backend API URL (defaults to http://127.0.0.1:8000/api)

## Getting Started

### Development Mode
The application runs automatically via the configured workflow:
- Backend runs on `http://127.0.0.1:8000`
- Frontend runs on `http://0.0.0.0:5000` (accessible via Replit webview)

### Important Setup Note
**You need to add your Gemini API key** to use the content generation features:
1. Get an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add it as a secret in Replit with the name `GEMINI_API_KEY`

## Features

### User Management
- User registration and authentication
- JWT-based session management
- Secure password hashing

### Social Media Accounts
- Connect multiple social media platforms
- Manage account credentials securely
- Toggle accounts on/off

### Content Preferences
- Customize posting style (professional, casual, etc.)
- Set tone (friendly, formal, etc.)
- Configure content length
- Manage topics and hashtags
- Toggle emoji usage

### AI Content Generation
- Generate content using Gemini AI
- Customizable prompts based on user preferences
- Automatic hashtag generation
- Platform-specific optimization

### Post Management
- Create and save posts
- Schedule posts for future publication
- Edit and delete posts
- Track post status (draft, scheduled, published)
- View posting calendar

## Database Schema

### Users
- Authentication and profile information
- One-to-many relationships with social accounts, preferences, and posts

### Social Accounts
- Platform name and account details
- OAuth tokens (encrypted)
- Connection status

### Content Preferences
- User-specific content generation settings
- Topics, hashtags, style preferences

### Posts
- Post content and metadata
- Scheduling information
- Publication status
- Target platforms

## API Documentation

Backend API runs on port 8000 with the following endpoints:
- `/api/auth/*` - Authentication (register, login)
- `/api/users/*` - User management
- `/api/social-accounts/*` - Social media account management
- `/api/preferences/*` - Content preference settings
- `/api/content/*` - AI content generation
- `/api/posts/*` - Post CRUD operations

API documentation available at: `http://127.0.0.1:8000/docs` (when running locally)

## Known Issues & Limitations
- Social media OAuth integration not yet implemented (accounts stored but not connected to real platforms)
- Automated posting scheduler not yet implemented
- GEMINI_API_KEY must be manually added by the user

## Next Steps
1. Add GEMINI_API_KEY to Replit Secrets
2. Implement OAuth flows for social media platforms
3. Add automated posting scheduler
4. Implement actual social media API integrations (X, Facebook, Instagram, Threads, LinkedIn)
5. Add post analytics and performance tracking
