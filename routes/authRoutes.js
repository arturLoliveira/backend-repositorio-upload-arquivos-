const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();


router.post('/courses/:courseId/users', authController.addUserToCourse);


router.post('/auth/login', authController.login);

router.post('/auth/recover-password', authController.requestPasswordReset);

router.post('/auth/reset-password/:token', authController.resetPassword);

module.exports = router;
