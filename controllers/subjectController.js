const multer = require('multer');
const path = require('path');
const coursesDB = require('../db/couch');
const fs = require('fs');



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));  
  }
});

const upload = multer({ storage: storage });

exports.addFileToSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }


    const fileUrl = `http://localhost:3001/uploads/${req.file.filename}`;
   

    const subject = await coursesDB.get(subjectId);

    if (!subject) {
      return res.status(404).json({ error: 'Matéria não encontrada.' });
    }

    subject.files.push({
      file_id: `file_${new Date().getTime()}`,
      name: req.file.filename,
      original_name: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype,
      upload_date: new Date().toISOString(),
      url: fileUrl 
    });

    const response = await coursesDB.insert(subject);

    res.status(201).json({
      message: 'Arquivo adicionado com sucesso',
      subjectId: response.id,
      rev: response.rev,
      url: fileUrl 
    });
  } catch (err) {
    console.error('Erro ao adicionar arquivo à matéria:', err);
    res.status(500).json({ error: 'Erro ao adicionar arquivo', details: err.message || err });
  }
};

exports.getFilesForSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;


    const subject = await coursesDB.get(subjectId);

    if (!subject || !subject.files) {
      return res.status(404).json({ error: 'Nenhum arquivo encontrado para esta matéria.' });
    }

    res.status(200).json({ files: subject.files });
  } catch (err) {
    console.error('Erro ao buscar arquivos para a matéria:', err);
    res.status(500).json({ error: 'Erro ao buscar arquivos', details: err.message || err });
  }
};
exports.getSubject = async (req, res) => {
  try {
    const { courseId } = req.params;

    const courses = await coursesDB.get(courseId);


    if (!courses.subjects) {
      return res.status(404).json({ error: 'Nenhuma matéria encontrada.' });
    }

    res.status(200).json({ subjects: courses.subjects });
  } catch (err) {
    console.error('Erro ao buscar a matéria:', err);
    res.status(500).json({ error: 'Erro ao buscar a materia', details: err.message || err });
  }
};

exports.deleteFileFromSubject = async (req, res) => {
  try {
    const { subjectId, fileId } = req.params;

    const subject = await coursesDB.get(subjectId);

    const fileIndex = subject.files.findIndex(file => file.file_id === fileId);

    if (fileIndex === -1) {
      return res.status(404).json({ error: 'Arquivo não encontrado' });
    }

    const file = subject.files[fileIndex];
    const filePath = path.join( 'uploads', file.name);

    subject.files.splice(fileIndex, 1);

    await coursesDB.insert(subject);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Erro ao deletar arquivo físico:', err);
        return res.status(500).json({ error: 'Erro ao deletar arquivo físico' });
      }
      console.log('Arquivo deletado com sucesso:', filePath);
    });

    return res.status(200).json({ message: 'Arquivo deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar arquivo:', err);
    return res.status(500).json({ error: 'Erro ao deletar arquivo', details: err });
  }
};

exports.upload = upload;
