const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();


router.post('/courses/:courseId/users', authController.addUserToCourse);


router.post('/auth/login', authController.login);

module.exports = router;
