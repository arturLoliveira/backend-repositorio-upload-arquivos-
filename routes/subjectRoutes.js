const express = require('express');
const subjectController = require('../controllers/subjectController');
const authController = require('../controllers/authController');

const router = express.Router();


router.get('/subjects/:subjectId/files', subjectController.getFilesForSubject); 
router.get('/subjects/folders/:folderId/files', subjectController.getFilesForFolders); 


router.delete('/subjects/:subjectId/files/:fileId', authController.adminProtect, subjectController.deleteFileFromSubject);
router.delete('/subjects/folders/:folderId/files/:fileId', authController.adminProtect, subjectController.deleteFileFromFolders);


router.get('/courses/:courseId/subject', subjectController.getSubject); 
router.get('/subjects/:subjectId/folders', subjectController.getFolder); 

router.post('/subjects/:subjectId/files', subjectController.upload.single('file'), subjectController.addFileToSubject); 
router.post('/subjects/folders/:folderId/files', subjectController.upload.single('file'), subjectController.addFileToFolder); 



module.exports = router;
