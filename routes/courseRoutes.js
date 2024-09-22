const express = require('express');
const courseController = require('../controllers/courseController');
const subjectController = require('../controllers/subjectController');
const router = express.Router();

// Rota para criar um curso
router.post('/courses', courseController.addCourse);

// Rota para adicionar uma matéria a um curso
router.post('/courses/:courseId/subjects', courseController.addSubjectToCourse);

// Rota para adicionar um arquivo a uma matériac

router.post('/subjects/:subjectId/files', subjectController.upload.single('file'), subjectController.addFileToSubject);



module.exports = router;
