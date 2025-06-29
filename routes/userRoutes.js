const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', registerUser); 
router.post('/login', loginUser); 
router.get('/me', protect, getMe); 

router.post('/logout', (req, res) => {
    res.status(200).json({ message: 'Logged out successfully (client should delete token)' });
  });

module.exports = router;
