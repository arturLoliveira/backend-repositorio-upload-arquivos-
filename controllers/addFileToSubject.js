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
  