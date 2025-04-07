const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerification);

// Protected routes
router.use(authMiddleware.protect);
router.post('/logout', authController.logout);
router.get('/me', authController.getMe);

// Add more protected routes here

module.exports = router;
