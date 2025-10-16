# Perspectiva Survey Platform

A complete full-stack survey platform built with Node.js, MySQL, and vanilla JavaScript. Users can register, login, create surveys, participate in surveys, and compete on leaderboards.

## 🚀 Features

- **Secure Authentication**: JWT-based login/register with bcrypt password hashing
- **User Profiles**: Complete user management with academic information
- **Survey System**: Create and participate in surveys with multiple question types
- **Points & Leaderboard**: Earn points for completing surveys and compete with others
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Real-time Validation**: Client and server-side validation with clear error messages

## 🛠 Tech Stack

**Backend:**
- Node.js + Express.js
- MySQL database
- JWT authentication
- bcryptjs for password hashing
- CORS enabled

**Frontend:**
- HTML5, CSS3, Vanilla JavaScript
- Responsive design (no frameworks)
- Modern UI with smooth animations

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MySQL** (v5.7 or higher) - [Download here](https://dev.mysql.com/downloads/)
- **npm** (comes with Node.js)

## 🔧 Installation & Setup

### 1. Download the Project

If you have the project as a ZIP file, extract it to your desired location.

### 2. Install Dependencies

```bash
# Navigate to project directory
cd perspectiva-survey-platform

# Install all required packages
npm install
```

### 3. Database Configuration

Create a `.env` file in the root directory:

```bash
# Copy the example file
cp .env.example .env
```

Edit the `.env` file with your MySQL credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=perspectiva_survey

# JWT Secret (change this in production)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Server Port
PORT=3000
```

### 4. Initialize Database

Run the database setup script to create tables and sample data:

```bash
npm run setup
```

This will:
- Create the `perspectiva_survey` database
- Create all necessary tables
- Insert sample users and surveys

### 5. Start the Server

```bash
# Development mode (auto-restart on changes)
npm run dev

# OR Production mode
npm start
```

### 6. Access the Application

Open your browser and go to: **http://localhost:3000**

## 👤 Sample Login Credentials

The setup script creates sample users for testing:

| Email | Password | Role |
|-------|----------|------|
| john.doe@example.com | password123 | Student |
| sarah.chen@example.com | password123 | Researcher |
| alex.rodriguez@example.com | password123 | Student |

## 📁 Project Structure

```
perspectiva-survey-platform/
├── server.js                 # Main server file
├── package.json              # Dependencies and scripts
├── .env.example              # Environment variables template
├── README.md                 # This file
├── config/
│   ├── database.js           # Database connection
│   └── setup.js              # Database initialization
├── controllers/
│   ├── authController.js     # Authentication logic
│   └── surveyController.js   # Survey management
├── models/
│   ├── User.js               # User model
│   └── Survey.js             # Survey model
├── routes/
│   ├── auth.js               # Authentication routes
│   └── surveys.js            # Survey routes
├── middleware/
│   └── auth.js               # JWT middleware & error handling
└── public/                   # Frontend files
    ├── index.html            # Landing page
    ├── login.html            # Login page
    ├── register.html         # Registration page
    └── dashboard.html        # Dashboard page
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)
- `PUT /api/auth/profile` - Update user profile (requires auth)

### Surveys
- `GET /api/surveys` - Get all surveys (requires auth)
- `GET /api/surveys/:id` - Get specific survey (requires auth)
- `POST /api/surveys` - Create new survey (requires auth)
- `POST /api/surveys/:id/responses` - Submit survey response (requires auth)

### Health Check
- `GET /api/health` - Server and database status

## 🗄️ Database Schema

### Tables Created:
- **users** - User accounts and profiles
- **surveys** - Survey definitions
- **survey_questions** - Individual questions for each survey
- **survey_responses** - User responses to surveys

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Both client and server-side
- **CORS Protection**: Cross-origin request handling
- **Error Handling**: Comprehensive error management

## 🚨 Troubleshooting

### Common Issues:

**1. Database Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution:** 
- Make sure MySQL is running
- Check your credentials in `.env`
- Verify the database exists

**2. Port Already in Use**
```
Error: listen EADDRINUSE :::3000
```
**Solution:**
- Change the PORT in `.env` file
- Or kill the process using port 3000

**3. JWT Token Errors**
```
Error: Invalid or expired token
```
**Solution:**
- Clear browser localStorage
- Login again
- Check JWT_SECRET in `.env`

**4. Module Not Found**
```
Error: Cannot find module 'express'
```
**Solution:**
- Run `npm install` to install dependencies
- Make sure you're in the correct directory

### Database Reset

If you need to reset the database:

```bash
# This will recreate all tables and sample data
npm run setup
```

## 🔄 Development Workflow

### Making Changes:

1. **Backend Changes**: Edit files in `controllers/`, `models/`, `routes/`
2. **Frontend Changes**: Edit HTML files in `public/`
3. **Database Changes**: Update `config/setup.js` and run `npm run setup`

### Adding New Features:

1. Create new routes in `routes/`
2. Add controllers in `controllers/`
3. Update models in `models/`
4. Create frontend pages in `public/`

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Verify your environment setup
3. Check the browser console for errors
4. Ensure all dependencies are installed

---

**Happy surveying! 🎉**