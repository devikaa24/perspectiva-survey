const User = require('../models/User');
const jwt = require('jsonwebtoken');

class AuthController {
  // Register new user
  static async register(req, res) {
    try {
      const { firstName, lastName, email, password, confirmPassword, dateOfBirth, institution, fieldOfStudy, academicLevel, graduationYear } = req.body;

      // Validation
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please fill in all required fields' 
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ 
          success: false, 
          message: 'Passwords do not match' 
        });
      }

      if (password.length < 6) {
        return res.status(400).json({ 
          success: false, 
          message: 'Password must be at least 6 characters long' 
        });
      }

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: 'User with this email already exists' 
        });
      }

      // Create user
      const userId = await User.create({
        firstName,
        lastName,
        email,
        password,
        dateOfBirth,
        institution,
        fieldOfStudy,
        academicLevel,
        graduationYear
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId, email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        token,
        user: {
          id: userId,
          firstName,
          lastName,
          email
        }
      });

    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle duplicate email error
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ 
          success: false, 
          message: 'User with this email already exists' 
        });
      }
      
      res.status(500).json({ 
        success: false, 
        message: 'Registration failed. Please try again.' 
      });
    }
  }

  // Login user
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please provide email and password' 
        });
      }

      // Find user
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid email or password' 
        });
      }

      // Verify password
      const isValidPassword = await User.verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid email or password' 
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Login failed. Please try again.' 
      });
    }
  }

  // Get current user profile
  static async getProfile(req, res) {
    try {
      const user = await User.getUserStats(req.user.userId);
      
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }

      res.json({
        success: true,
        user
      });

    } catch (error) {
      console.error('Profile fetch error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch profile' 
      });
    }
  }

  // Update user profile
  static async updateProfile(req, res) {
    try {
      const { firstName, lastName, dateOfBirth, institution, fieldOfStudy, academicLevel, graduationYear } = req.body;

      await User.updateProfile(req.user.userId, {
        firstName,
        lastName,
        dateOfBirth,
        institution,
        fieldOfStudy,
        academicLevel,
        graduationYear
      });

      res.json({
        success: true,
        message: 'Profile updated successfully'
      });

    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to update profile' 
      });
    }
  }
}

module.exports = AuthController;