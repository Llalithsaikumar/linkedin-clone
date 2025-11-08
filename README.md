# LinkedIn Clone - Full Stack Web Application

A professional social networking platform inspired by LinkedIn, built with React, Node.js, Express, and MongoDB. Users can sign up, create posts, interact with content, and build their professional network.

![LinkedIn Clone](https://img.shields.io/badge/React-18.3.1-blue) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Latest-brightgreen) ![Express](https://img.shields.io/badge/Express-4.19.2-lightgrey)

## 🚀 Features

### Core Features
- ✅ **User Authentication**
  - User registration with email and password
  - Secure login with JWT tokens
  - Session persistence
  - Protected routes

- ✅ **Post Management**
  - Create text posts
  - Upload images with posts
  - View all posts in a public feed
  - Posts sorted by latest first
  - Edit and delete your own posts

- ✅ **Social Interactions**
  - Like/unlike posts
  - Add comments to posts
  - View like and comment counts
  - Real-time updates

- ✅ **User Profiles**
  - View any user's profile
  - See all posts by a specific user
  - Profile information display
  - Member since date

### UI/UX Features
- LinkedIn-inspired professional design
- Responsive layout
- User avatars with initials
- Clean, modern interface
- Smooth interactions and animations

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM 6.26.2** - Client-side routing
- **Axios 1.7.7** - HTTP client for API calls
- **CSS3** - Styling (LinkedIn-inspired design)

### Backend
- **Node.js 18+** - Runtime environment
- **Express.js 4.19.2** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose 8.6.2** - MongoDB object modeling
- **JWT (jsonwebtoken 9.0.2)** - Authentication tokens
- **bcryptjs 2.4.3** - Password hashing
- **Multer 1.4.5** - File upload handling
- **CORS 2.8.5** - Cross-origin resource sharing
- **dotenv 16.4.5** - Environment variables

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud)
- **npm** (comes with Node.js) or **yarn**

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/linkedin-clone.git
cd linkedin-clone
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
# On Windows (PowerShell):
New-Item .env
# On Mac/Linux:
touch .env
```

Add the following to `server/.env`:

```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/linkedin_clone
JWT_SECRET=your_super_secret_jwt_key_change_this
CLIENT_ORIGIN=http://localhost:5173
```

**Important:** Replace `your_super_secret_jwt_key_change_this` with a long, random string for security.

**For MongoDB Atlas (Cloud):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/linkedin_clone?retryWrites=true&w=majority
```

### 3. Frontend Setup

```bash
# Navigate to client directory (from project root)
cd ../client

# Install dependencies
npm install

# Create .env file (optional - defaults work for local dev)
# On Windows (PowerShell):
New-Item .env
# On Mac/Linux:
touch .env
```

Add to `client/.env` (optional):

```env
VITE_API_URL=http://localhost:4000/api
```

## 🚀 Running the Project

### Start MongoDB

**Local MongoDB:**
```bash
# On Windows
mongod

# On Mac/Linux
sudo systemctl start mongod
# or
brew services start mongodb-community
```

**MongoDB Atlas:** No local setup needed, just use your connection string in `.env`.

### Start Backend Server

```bash
# From server directory
cd server
npm run dev
```

The server will start on `http://localhost:4000`

### Start Frontend Development Server

Open a **new terminal** and run:

```bash
# From client directory
cd client
npm run dev
```

The app will open at `http://localhost:5173`

## 📁 Project Structure

```
linkedin-clone/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── api.js         # API configuration
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   ├── styles.css     # Global styles
│   │   ├── context/       # React context (Auth)
│   │   └── pages/         # Page components
│   │       ├── Feed.jsx
│   │       ├── Login.jsx
│   │       ├── Signup.jsx
│   │       └── Profile.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                # Backend Express application
│   ├── src/
│   │   ├── index.js       # Server entry point
│   │   ├── models/        # MongoDB models
│   │   │   ├── User.js
│   │   │   └── Post.js
│   │   ├── routes/        # API routes
│   │   │   ├── auth.js
│   │   │   ├── posts.js
│   │   │   └── users.js
│   │   └── middleware/    # Custom middleware
│   │       └── auth.js
│   ├── uploads/            # Uploaded images (auto-created)
│   ├── package.json
│   └── .env
│
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `GET /api/auth/me` - Get current user (requires auth token)

### Posts
- `GET /api/posts` - Get all posts (public)
- `POST /api/posts` - Create a post (requires auth)
  ```json
  {
    "text": "Hello world!",
    "imageUrl": "/uploads/image.jpg" // optional
  }
  ```
- `PUT /api/posts/:id` - Update post (owner only)
- `DELETE /api/posts/:id` - Delete post (owner only)
- `POST /api/posts/:id/like` - Like/unlike post (requires auth)
- `POST /api/posts/:id/comments` - Add comment (requires auth)
  ```json
  {
    "text": "Great post!"
  }
  ```

### Users
- `GET /api/users/:id` - Get user profile and posts

### Upload
- `POST /api/upload` - Upload image (multipart/form-data, requires auth)

## 🎨 Features Breakdown

### 1. User Authentication
- Secure password hashing with bcrypt
- JWT token-based authentication
- Token stored in localStorage
- Automatic token validation on page load
- Protected routes for authenticated users

### 2. Post Creation & Management
- Rich text posts
- Image upload support
- Real-time feed updates
- Edit and delete functionality for post owners
- Timestamp display

### 3. Social Features
- **Likes**: Toggle like/unlike on posts
- **Comments**: Add comments with user attribution
- **Counts**: Display like and comment counts
- **Interactions**: Smooth UI for all interactions

### 4. User Profiles
- Public profile pages
- User information display
- All posts by user
- Member since date
- Professional layout

### 5. UI/UX
- LinkedIn-inspired color scheme (#0a66c2)
- Responsive design
- User avatars with initials
- Professional typography
- Smooth animations and transitions
- Clean, modern interface

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Input validation
- CORS configuration
- Environment variables for sensitive data

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally, or
- Check your MongoDB Atlas connection string
- Verify network access in MongoDB Atlas

### Port Already in Use
- Change `PORT` in `server/.env`
- Update `CLIENT_ORIGIN` if you change the port

### Image Upload Not Working
- Ensure `server/uploads/` directory exists (auto-created)
- Check file permissions
- Verify multer is installed

### CORS Errors
- Ensure `CLIENT_ORIGIN` in `server/.env` matches your frontend URL
- Default: `http://localhost:5173`

## 📝 Environment Variables

### Server (.env)
```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/linkedin_clone
JWT_SECRET=your_secret_key_here
CLIENT_ORIGIN=http://localhost:5173
```

### Client (.env) - Optional
```env
VITE_API_URL=http://localhost:4000/api
```

## 🚢 Production Build

### Build Frontend
```bash
cd client
npm run build
```
Output will be in `client/dist/`

### Run Production Server
```bash
cd server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).


## 🙏 Acknowledgments

- Inspired by LinkedIn's design and functionality
- Built with modern web technologies
- Educational project for full-stack development

---

**Note:** This is a clone project for educational purposes. Not affiliated with LinkedIn.
