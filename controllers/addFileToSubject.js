exports.addFileToSubject = async (req, res) => {
    try {
      const { subjectId } = req.params;
      const { name, size, type } = req.body; 
  
      const subject = await coursesDB.get(subjectId);
  
      subject.files.push({
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
exports.deleteFileFromSubject = async (req, res) => {
    try {
      
      const { subjectId, fileId } = req.params;
      

      const subject = await coursesDB.get(subjectId);
  
     
      if (!subject.files || subject.files.length === 0) {
        return res.status(404).json({ error: 'Nenhum arquivo encontrado para esta matéria.' });
      }
  
      
      const fileIndex = subject.files.findIndex(file => file.file_id === fileId);
  
     
      if (fileIndex === -1) {
        return res.status(404).json({ error: 'Arquivo não encontrado.' });
      }
  
      
      subject.files.splice(fileIndex, 1);
  
     
      const response = await coursesDB.insert(subject);
  
      res.status(200).json({
        message: 'Arquivo removido com sucesso',
        subjectId: response.id,
        rev: response.rev
      });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao remover arquivo', details: err });
    }
  };
  