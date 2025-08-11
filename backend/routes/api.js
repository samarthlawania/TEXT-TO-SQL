const express = require('express');
const { loginUser,registerUser } = require('../controllers/authController');
const { connectDb } = require('../controllers/dbController');
const { inviteUser, setRole } = require('../controllers/userController');
const { executeSandboxQuery, syncQuery, getHistory } = require('../controllers/queryController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Auth route
router.post('/login', loginUser);
router.post('/connect-db', protect, connectDb);
router.post('/invite-user', protect, inviteUser);
router.post('/set-role', protect, setRole);
router.post('/query/sandbox', protect, executeSandboxQuery);
router.post('/query/sync', protect, syncQuery);
router.post('/register', registerUser);
router.get('/history', protect, getHistory);

module.exports = router;