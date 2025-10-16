const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
  console.log('🚀 Setting up Perspectiva Survey Database...');
  
  try {
    // Connect without database first
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    // Create database
    console.log('📦 Creating database...');
    await connection.execute('CREATE DATABASE IF NOT EXISTS perspectiva_survey');
    await connection.execute('USE perspectiva_survey');

    // Create tables
    console.log('🏗️  Creating tables...');
    
    // Users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        date_of_birth DATE,
        institution VARCHAR(100),
        field_of_study VARCHAR(100),
        academic_level ENUM('undergraduate', 'graduate', 'postgraduate', 'phd', 'other'),
        graduation_year YEAR,
        profile_picture VARCHAR(255),
        total_points INT DEFAULT 0,
        surveys_completed INT DEFAULT 0,
        current_streak INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Surveys table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS surveys (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        category VARCHAR(50) NOT NULL,
        estimated_time INT DEFAULT 5,
        thumbnail VARCHAR(255),
        created_by INT NOT NULL,
        is_published BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Survey questions table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS survey_questions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        survey_id INT NOT NULL,
        question_text TEXT NOT NULL,
        question_type ENUM('single-choice', 'multiple-choice', 'text', 'rating') NOT NULL,
        options JSON,
        is_required BOOLEAN DEFAULT TRUE,
        question_order INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE
      )
    `);

    // Survey responses table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS survey_responses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        survey_id INT NOT NULL,
        user_id INT NOT NULL,
        responses JSON NOT NULL,
        time_spent INT DEFAULT 0,
        rating INT DEFAULT NULL,
        points_earned INT DEFAULT 50,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_survey (user_id, survey_id)
      )
    `);

    // Insert sample data
    console.log('📝 Inserting sample data...');
    
    // Sample users (password is 'password123' hashed)
    const hashedPassword = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm';
    
    await connection.execute(`
      INSERT IGNORE INTO users (id, first_name, last_name, email, password, institution, field_of_study, academic_level, total_points, surveys_completed) VALUES
      (1, 'John', 'Doe', 'john.doe@example.com', '${hashedPassword}', 'Local University', 'Computer Science', 'undergraduate', 1250, 23),
      (2, 'Sarah', 'Chen', 'sarah.chen@example.com', '${hashedPassword}', 'MIT', 'Data Science', 'graduate', 2850, 47),
      (3, 'Alex', 'Rodriguez', 'alex.rodriguez@example.com', '${hashedPassword}', 'Stanford', 'Engineering', 'undergraduate', 2720, 43)
    `);

    // Sample surveys
    await connection.execute(`
      INSERT IGNORE INTO surveys (id, title, description, category, estimated_time, created_by, is_published) VALUES
      (1, 'Student Learning Preferences', 'Help us understand how students prefer to learn in modern educational environments.', 'Education', 5, 2, TRUE),
      (2, 'Technology Usage Survey', 'Share your thoughts on how technology impacts daily productivity and work-life balance.', 'Technology', 8, 2, TRUE),
      (3, 'Environmental Awareness', 'Help us understand public awareness and attitudes towards environmental conservation.', 'Environment', 6, 3, TRUE)
    `);

    // Sample questions
    await connection.execute(`
      INSERT IGNORE INTO survey_questions (survey_id, question_text, question_type, options, question_order) VALUES
      (1, 'What is your preferred learning style?', 'single-choice', '["Visual (diagrams, charts)", "Auditory (lectures, discussions)", "Kinesthetic (hands-on activities)", "Reading/Writing"]', 1),
      (1, 'Which digital tools do you find most helpful for learning?', 'multiple-choice', '["Video tutorials", "Interactive simulations", "Online quizzes", "Discussion forums", "Mobile apps"]', 2),
      (1, 'How would you rate the effectiveness of online learning?', 'rating', '[]', 3)
    `);

    await connection.end();
    
    console.log('✅ Database setup completed successfully!');
    console.log('👤 Sample users created:');
    console.log('   📧 john.doe@example.com (password: password123)');
    console.log('   📧 sarah.chen@example.com (password: password123)');
    console.log('   📧 alex.rodriguez@example.com (password: password123)');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;