const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Create new user
  static async create(userData) {
    const { firstName, lastName, email, password, dateOfBirth, institution, fieldOfStudy, academicLevel, graduationYear } = userData;
    
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);
      
      const [result] = await pool.execute(
        `INSERT INTO users (first_name, last_name, email, password, date_of_birth, institution, field_of_study, academic_level, graduation_year) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [firstName, lastName, email, hashedPassword, dateOfBirth, institution, fieldOfStudy, academicLevel, graduationYear]
      );
      
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, first_name, last_name, email, date_of_birth, institution, field_of_study, academic_level, graduation_year, total_points, surveys_completed, current_streak, created_at FROM users WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Update user profile
  static async updateProfile(id, userData) {
    const { firstName, lastName, dateOfBirth, institution, fieldOfStudy, academicLevel, graduationYear } = userData;
    
    try {
      await pool.execute(
        `UPDATE users SET first_name = ?, last_name = ?, date_of_birth = ?, institution = ?, 
         field_of_study = ?, academic_level = ?, graduation_year = ? WHERE id = ?`,
        [firstName, lastName, dateOfBirth, institution, fieldOfStudy, academicLevel, graduationYear, id]
      );
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get user stats with ranking
  static async getUserStats(id) {
    try {
      const [rows] = await pool.execute(`
        SELECT u.*, 
        (SELECT COUNT(*) + 1 FROM users u2 WHERE u2.total_points > u.total_points) as rank
        FROM users u 
        WHERE u.id = ?
      `, [id]);
      
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;