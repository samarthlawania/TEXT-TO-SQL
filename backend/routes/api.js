const express = require('express');
const { loginUser } = require('../controllers/authController');
const { executeQuery, getHistory } = require('../controllers/queryController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Auth route
router.post('/login', loginUser);

// Protected routes
router.post('/query', protect, executeQuery);
router.get('/history', protect, getHistory);

module.exports = router;