const express = require('express');
const { signup, login } = require('../controllers/authController');
const { 
  getUserProfile, 
  updateUserProfile, 
  deleteUserAccount 
} = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Authentication Routes
router.post('/signup', signup);
router.post('/login', login);

// User Management Routes
router.get('/profile', verifyToken, getUserProfile);
router.put('/profile', verifyToken, updateUserProfile);
router.delete('/account', verifyToken, deleteUserAccount);

module.exports = router;