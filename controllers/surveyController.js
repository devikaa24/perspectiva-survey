const Survey = require('../models/Survey');

class SurveyController {
  // Get all surveys
  static async getAllSurveys(req, res) {
    try {
      const { category, search } = req.query;
      
      const surveys = await Survey.getAll({ category, search });
      
      // Check completion status for current user
      const surveysWithCompletion = await Promise.all(
        surveys.map(async (survey) => {
          const completed = await Survey.hasUserCompleted(survey.id, req.user.userId);
          return { ...survey, completed };
        })
      );

      res.json({
        success: true,
        surveys: surveysWithCompletion
      });

    } catch (error) {
      console.error('Surveys fetch error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch surveys' 
      });
    }
  }

  // Get survey by ID
  static async getSurveyById(req, res) {
    try {
      const { id } = req.params;
      
      const survey = await Survey.getById(id);
      
      if (!survey) {
        return res.status(404).json({ 
          success: false, 
          message: 'Survey not found' 
        });
      }

      // Check if user has already completed this survey
      const completed = await Survey.hasUserCompleted(id, req.user.userId);

      res.json({
        success: true,
        survey: { ...survey, completed }
      });

    } catch (error) {
      console.error('Survey fetch error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch survey' 
      });
    }
  }

  // Create new survey
  static async createSurvey(req, res) {
    try {
      const { title, description, category, estimatedTime, questions } = req.body;

      // Validation
      if (!title || !description || !category || !questions || questions.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please fill in all required fields and add at least one question' 
        });
      }

      const surveyId = await Survey.create({
        title,
        description,
        category,
        estimatedTime,
        questions
      }, req.user.userId);

      res.status(201).json({
        success: true,
        message: 'Survey created successfully',
        surveyId
      });

    } catch (error) {
      console.error('Survey creation error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to create survey' 
      });
    }
  }

  // Submit survey response
  static async submitResponse(req, res) {
    try {
      const { id } = req.params;
      const { responses, timeSpent, rating } = req.body;

      // Check if user already responded
      const hasCompleted = await Survey.hasUserCompleted(id, req.user.userId);
      if (hasCompleted) {
        return res.status(400).json({ 
          success: false, 
          message: 'You have already completed this survey' 
        });
      }

      // Validate survey exists
      const survey = await Survey.getById(id);
      if (!survey) {
        return res.status(404).json({ 
          success: false, 
          message: 'Survey not found' 
        });
      }

      const pointsEarned = await Survey.submitResponse(id, req.user.userId, {
        responses,
        timeSpent,
        rating
      });

      res.json({
        success: true,
        message: 'Response submitted successfully',
        pointsEarned
      });

    } catch (error) {
      console.error('Response submission error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to submit response' 
      });
    }
  }
}

module.exports = SurveyController;