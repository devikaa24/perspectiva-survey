const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { testConnection } = require('./config/database');
const { errorHandler, requestLogger } = require('./middleware/auth');

// Import routes
const authRoutes = require('./routes/auth');
const surveyRoutes = require('./routes/surveys');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/surveys', surveyRoutes);

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

// Serve create survey page
app.get('/create-survey', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'create-survey.html'));
});

// Serve individual survey page (placeholder)
app.get('/survey/:id', (req, res) => {
  // If you have a survey view page, serve it; otherwise reuse dashboard or show 404
  const surveyViewPath = path.join(__dirname, 'public', 'survey.html');
  res.sendFile(surveyViewPath, (err) => {
    if (err) {
      res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
    }
  });
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const dbConnected = await testConnection();
  res.json({
    success: true,
    status: 'Server is running',
    database: dbConnected ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// 404 handler for pages
app.use('*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Error handling middleware
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.log('⚠️  Warning: Database connection failed. Please check your configuration.');
      console.log('💡 Run "npm run setup" to initialize the database.');
    }

    app.listen(PORT, () => {
      console.log('🚀 Perspectiva Survey Platform');
      console.log(`📡 Server running on http://localhost:${PORT}`);
      console.log(`🗄️  Database: ${dbConnected ? '✅ Connected' : '❌ Disconnected'}`);
      console.log('📝 API Documentation:');
      console.log('   POST /api/auth/register - Register user');
      console.log('   POST /api/auth/login - Login user');
      console.log('   GET  /api/auth/profile - Get user profile');
      console.log('   GET  /api/surveys - Get all surveys');
      console.log('   GET  /api/health - Health check');
      console.log('');
      console.log('🌐 Open http://localhost:3000 to access the application');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();

module.exports = app;