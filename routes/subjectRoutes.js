const express = require('express');
const subjectController = require('../controllers/subjectController');
const router = express.Router();


router.get('/subjects/:subjectId/files', subjectController.getFilesForSubject); 


router.delete('/subjects/:subjectId/files/:fileId', subjectController.deleteFileFromSubject);


router.get('/courses/:courseId/subject', subjectController.getSubject); 


router.post('/subjects/:subjectId/files', subjectController.upload.single('file'), subjectController.addFileToSubject); 



module.exports = router;
