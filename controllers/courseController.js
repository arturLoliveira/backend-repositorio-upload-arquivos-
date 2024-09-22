const coursesDB = require('../db/couch'); // Certifique-se de que está importando o 'coursesDB' corretamente

exports.addCourse = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validação básica
    if (!name || !description) {
      throw new Error('O nome e a descrição são obrigatórios.');
    }

    // Criação do documento do curso no CouchDB
    const response = await coursesDB.insert({
      _id: `course_${name.toLowerCase().replace(/\s/g, '_')}`,
      type: 'course',
      name,
      description,
      subjects: []  // Inicialmente, sem matérias
    });

    // Envia a resposta de sucesso
    res.status(201).json({
      message: 'Curso criado com sucesso',
      id: response.id,
      rev: response.rev
    });

  } catch (err) {
    console.error('Erro ao criar curso:', err); // Log no servidor para depuração
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

    // Busca o curso no banco de dados
    const course = await coursesDB.get(courseId);
    
    if (!course) {
      return res.status(404).json({ error: 'Curso não encontrado.' });
    }

    // Cria a nova matéria
    const newSubject = {
      _id: `${name.toLowerCase().replace(/\s/g, '_')}`,
      type: 'subject',
      name,
      course_id: courseId,
      files: []  // Iniciando sem arquivos
    };

    // Insere a nova matéria no CouchDB
    await coursesDB.insert(newSubject);

    // Adiciona a nova matéria ao curso
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
  exports.addFileToSubject = async (req, res) => {
    try {
      const { subjectId } = req.params;
      const { name, size, type } = req.body; // Metadados do arquivo
  
      // Busca a matéria pelo ID
      const subject = await coursesDB.get(subjectId);
  
      // Adiciona o arquivo à lista de arquivos da matéria
      subject.files.push({
        file_id: `file_${new Date().getTime()}`,
        name,
        size,
        type,
        upload_date: new Date().toISOString()
      });
  
      // Atualiza o documento da matéria com o novo arquivo
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
  