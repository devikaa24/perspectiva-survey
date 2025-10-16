const express = require('express');
const SurveyController = require('../controllers/surveyController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All survey routes require authentication
router.use(authenticateToken);

// Survey routes
router.get('/', SurveyController.getAllSurveys);
router.get('/:id', SurveyController.getSurveyById);
router.post('/', SurveyController.createSurvey);
router.post('/:id/responses', SurveyController.submitResponse);

module.exports = router;