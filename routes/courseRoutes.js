const express = require('express');
const courseController = require('../controllers/courseController');
const subjectController = require('../controllers/subjectController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/courses', courseController.addCourse);

router.post('/courses/:courseId/subjects', authController.adminProtect, courseController.addSubjectToCourse);


router.post('/subjects/:subjectId/files', subjectController.upload.single('file'), subjectController.addFileToSubject);



module.exports = router;
