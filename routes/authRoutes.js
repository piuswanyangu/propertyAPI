// register and login routes
const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Private route (requires token)
router.get('/me', protect, getMe);

module.exports = router;