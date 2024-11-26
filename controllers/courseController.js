const coursesDB = require('../db/couch');

exports.addCourse = async (req, res) => {
  try {
    const { name, description } = req.body;


    if (!name || !description) {
      throw new Error('O nome e a descrição são obrigatórios.');
    }


    const response = await coursesDB.insert({
      _id: `course_${name.toLowerCase().replace(/\s/g, '_')}`,
      type: 'course',
      name,
      description,
      subjects: []
    });


    res.status(201).json({
      message: 'Curso criado com sucesso',
      id: response.id,
      rev: response.rev
    });

  } catch (err) {
    console.error('Erro ao criar curso:', err);
    res.status(500).json({
      error: 'Erro ao criar curso',
      details: err.message || err
    });
  }
};

exports.addSubjectToCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Nome da matéria é obrigatório.' });
    }
    const course = await coursesDB.get(courseId);

    if (!course) {
      return res.status(404).json({ error: 'Curso não encontrado.' });
    }


    const newSubject = {
      _id: `${name.toLowerCase().replace(/\s/g, '_')}`,
      type: 'subject',
      name,
      course_id: courseId,
      files: [],
      folders: []
    };


    await coursesDB.insert(newSubject);

    if (!course.subjects) {
      course.subjects = [];
    }
    course.subjects.push(newSubject._id);
    await coursesDB.insert(course);

    res.status(201).json({ message: 'Matéria adicionada ao curso com sucesso', subjectId: newSubject._id });
  } catch (err) {
    console.error('Erro ao adicionar matéria ao curso:', err);
    res.status(500).json({ error: 'Erro ao adicionar matéria', details: err.message });
  }
};
exports.addFolderToSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Nome da pasta é obrigatório.' });
    }
    const subject = await coursesDB.get(subjectId);

    if (!subject) {
      return res.status(404).json({ error: 'Matéria não encontrada.' });
    }


    const newFolder = {
      _id: `${name.toLowerCase().replace(/\s/g, '_')}`,
      type: 'folder',
      name,
      subject_id: subjectId,
      files: []
    };


    await coursesDB.insert(newFolder);

    if (!subject.folders) {
      subject.folders = [];
    }
    subject.folders.push(newFolder._id);
    await coursesDB.insert(subject);

    res.status(201).json({ message: 'Matéria adicionada ao curso com sucesso', subjectId: newFolder._id });
  } catch (err) {
    console.error('Erro ao adicionar matéria ao curso:', err);
    res.status(500).json({ error: 'Erro ao adicionar matéria', details: err.message });
  }
};
// exports.addFoldersToSubject = async (req, res) => {
//   try {
//     const { subjectId } = req.params;
//     const { name} = req.body;

//     const subject = await coursesDB.get(subjectId);

//     subject.folders.push({
//       folder_id: `file_${new Date().getTime()}`,
//       name,
//       files: []
//     });

//     const response = await coursesDB.insert(subject);

//     res.status(201).json({
//       message: 'Pasta adicionada com sucesso',
//       folderId: response.id,
//       rev: response.rev
//     });
//   } catch (err) {
//     res.status(500).json({ error: 'Erro ao adicionar pasta', details: err });
//   }
// };
exports.addFileToSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { name, size, type } = req.body;

    const subject = await coursesDB.get(subjectId);

    subject.folders.files.push({
      file_id: `file_${new Date().getTime()}`,
      name,
      size,
      type,
      upload_date: new Date().toISOString()
    });

    const response = await coursesDB.insert(subject);

    res.status(201).json({
      message: 'Arquivo adicionado com sucesso',
      subjectId: response.id,
      rev: response.rev
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao adicionar arquivo', details: err });
  }
};
exports.addFileToFolder = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { name, size, type } = req.body;

    const subject = await coursesDB.get(subjectId);

    subject.folders.files.push({
      file_id: `file_${new Date().getTime()}`,
      name,
      size,
      type,
      upload_date: new Date().toISOString()
    });

    const response = await coursesDB.insert(subject);

    res.status(201).json({
      message: 'Arquivo adicionado com sucesso',
      subjectId: response.id,
      rev: response.rev
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao adicionar arquivo', details: err });
  }
};
