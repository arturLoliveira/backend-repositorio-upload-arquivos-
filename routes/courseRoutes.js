const express = require('express');
const courseController = require('../controllers/courseController');
const subjectController = require('../controllers/subjectController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/courses', courseController.addCourse);

router.post('/courses/:courseId/subjects', authController.adminProtect, courseController.addSubjectToCourse);
router.post('/courses/:subjectId/folders', courseController.addFolderToSubject);


router.post('/subjects/:subjectId/files', subjectController.upload.single('file'), subjectController.addFileToSubject);
router.post('/subjects/folders/:folderId/files', subjectController.upload.single('file'), subjectController.addFileToFolder);



module.exports = router;
