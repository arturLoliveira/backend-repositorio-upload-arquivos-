const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Rota de registro
router.post('/courses/:courseId/users',authController.addUserToCourse);


// Rota de login
// router.post('/auth/login', authController.login);

module.exports = router;
