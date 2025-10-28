# LinkCut - URL Shortener

A full-stack URL shortener web application built with the MERN stack and TypeScript, featuring repository pattern and responsive design.

## 🌐 Live Demo

- **Frontend**: [https://linkcut.shop](https://linkcut.shop)
- **Backend API**: [https://api.linkcut.shop](https://api.linkcut.shop)

## 🚀 Features

### Core Functionality
- **URL Shortening**: Convert long URLs into short, shareable links
- **User Authentication**: Secure register/login with JWT tokens
- **URL Management**: View and manage all your shortened URLs
- **Redirection**: Seamless redirection from short URLs to original destinations

### Technical Features
- **TypeScript**: Full TypeScript implementation for both frontend and backend
- **Repository Pattern**: Clean architecture with separation of concerns
- **Responsive Design**: Mobile-friendly UI built with CSS Modules
- **Pagination**: Efficient handling of URL lists with pagination
- **Secure Authentication**: HttpOnly cookies for secure token storage
- **Error Handling**: Comprehensive error handling and validation

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router** for navigation
- **CSS Modules** for styled components
- **Axios** for API calls

### Backend
- **Node.js** with Express and TypeScript
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Repository Pattern** for data access layer
- **CORS** with secure configuration
- **Cookie Parser** for token management

### Deployment
- **Frontend**: Vercel with custom domain (Godaddy)
- **Backend**: AWS EC2 instance
- **Database**: MongoDB Atlas

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/jitheshmaroli/URL-Shortener.git
   cd URL-Shortener/url-shortener-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create `.env` file:
   ```env
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key
   MONGODB_URI=your_mongodb_connection_string
   PORT=3000
   CLIENT_URL=http://localhost:5173
   BASE_URL=http://localhost:3000
   ```

4. **Run the application**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../url-shortner-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create `.env` file:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

4. **Run the application**
   ```bash
   # Development
   npm run dev
   
   # Production build
   npm run build
   ```

## 🔌 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check` - Verify authentication status

### URL Routes
- `POST /api/url/shorten` - Create short URL (Protected)
- `GET /api/url/myurls` - Get user's URLs (Protected)
- `GET /api/url/:shortCode` - Redirect to original URL

## 🏗 Architecture

The backend follows the **Repository Pattern**:

1. **Controllers**: Handle HTTP requests and responses
2. **Services**: Contain business logic
3. **Repositories**: Abstract data access layer
4. **DTOs**: Define data transfer objects
5. **Models**: Define database schemas

This separation ensures:
- **Testability**: Each layer can be tested independently
- **Maintainability**: Clear separation of concerns
- **Scalability**: Easy to modify or extend functionality

## 🔒 Security Features

- JWT authentication with HttpOnly cookies
- Password hashing with bcrypt
- CORS configuration for specific origins
- Input validation and sanitization
- Error handling without exposing sensitive information

## 🚀 Deployment

### Backend (AWS EC2)
1. Set up EC2 instance with Node.js environment
2. Configure security groups for HTTP/HTTPS
3. Set up PM2 for process management
4. Configure environment variables
5. Set up Nginx reverse proxy

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Configure build settings for Vite
3. Set environment variables
4. Connect custom domain from Godaddy

### Domain Configuration
- Frontend: `linkcut.shop` (Vercel)
- Backend: `api.linkcut.shop` (AWS EC2)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure CLIENT_URL in backend matches frontend domain
   - Check CORS configuration in backend

2. **Authentication Issues**
   - Verify JWT_SECRET is set correctly
   - Check cookie settings for production vs development

3. **Database Connection**
   - Verify MONGODB_URI is correct
   - Check network access for MongoDB Atlas

---

**Built with ❤️ using the MERN stack and TypeScript**
