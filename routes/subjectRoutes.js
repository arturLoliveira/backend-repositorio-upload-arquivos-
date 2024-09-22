const express = require('express');
const subjectController = require('../controllers/subjectController');
const router = express.Router();

// Rota para listar todos os arquivos e um curso
router.get('/subjects/:subjectId/files', subjectController.getFilesForSubject); 

router.get('/courses/:courseId/subject', subjectController.getSubject); 

// Rota para adicionar arquivos a uma matéria
router.post('/subjects/:subjectId/files', subjectController.upload.single('file'), subjectController.addFileToSubject); // Adicionada a configuração para upload



module.exports = router;
