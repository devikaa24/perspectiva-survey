const { pool } = require('../config/database');

class Survey {
  // Get all surveys with author info
  static async getAll(filters = {}) {
    try {
      let query = `
        SELECT s.*, u.first_name, u.last_name,
        COUNT(DISTINCT sr.id) as participants,
        AVG(sr.rating) as average_rating
        FROM surveys s 
        LEFT JOIN users u ON s.created_by = u.id 
        LEFT JOIN survey_responses sr ON s.id = sr.survey_id 
        WHERE s.is_published = 1
      `;
      
      const params = [];
      
      if (filters.category && filters.category !== 'all') {
        query += ' AND s.category = ?';
        params.push(filters.category);
      }
      
      if (filters.search) {
        query += ' AND (s.title LIKE ? OR s.description LIKE ?)';
        params.push(`%${filters.search}%`, `%${filters.search}%`);
      }
      
      query += ' GROUP BY s.id ORDER BY s.created_at DESC';
      
      const [rows] = await pool.execute(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get survey by ID with questions
  static async getById(id) {
    try {
      const [surveys] = await pool.execute(
        `SELECT s.*, u.first_name, u.last_name FROM surveys s 
         LEFT JOIN users u ON s.created_by = u.id WHERE s.id = ?`,
        [id]
      );

      if (surveys.length === 0) {
        return null;
      }

      const [questions] = await pool.execute(
        'SELECT * FROM survey_questions WHERE survey_id = ? ORDER BY question_order',
        [id]
      );

      const survey = surveys[0];
      survey.questions = questions.map(q => ({
        ...q,
        options: q.options ? JSON.parse(q.options) : []
      }));

      return survey;
    } catch (error) {
      throw error;
    }
  }

  // Create new survey
  static async create(surveyData, userId) {
    const { title, description, category, estimatedTime, questions } = surveyData;
    
    try {
      // Insert survey
      const [surveyResult] = await pool.execute(
        `INSERT INTO surveys (title, description, category, estimated_time, created_by) 
         VALUES (?, ?, ?, ?, ?)`,
        [title, description, category, estimatedTime, userId]
      );

      const surveyId = surveyResult.insertId;

      // Insert questions
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        await pool.execute(
          `INSERT INTO survey_questions (survey_id, question_text, question_type, options, is_required, question_order) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [surveyId, question.question, question.type, JSON.stringify(question.options || []), question.required, i + 1]
        );
      }

      return surveyId;
    } catch (error) {
      throw error;
    }
  }

  // Check if user has completed survey
  static async hasUserCompleted(surveyId, userId) {
    try {
      const [rows] = await pool.execute(
        'SELECT id FROM survey_responses WHERE survey_id = ? AND user_id = ?',
        [surveyId, userId]
      );
      return rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  // Submit survey response
  static async submitResponse(surveyId, userId, responseData) {
    const { responses, timeSpent, rating } = responseData;
    const pointsEarned = 50; // Base points
    
    try {
      await pool.execute(
        `INSERT INTO survey_responses (survey_id, user_id, responses, time_spent, rating, points_earned) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [surveyId, userId, JSON.stringify(responses), timeSpent, rating, pointsEarned]
      );

      // Update user stats
      await pool.execute(
        'UPDATE users SET total_points = total_points + ?, surveys_completed = surveys_completed + 1 WHERE id = ?',
        [pointsEarned, userId]
      );

      return pointsEarned;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Survey;