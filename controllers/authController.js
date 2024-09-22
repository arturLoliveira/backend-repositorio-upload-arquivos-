const coursesDB = require('../db/couch');

exports.addUserToCourse = async (req, res) => {
  const { courseId } = req.params;
  const { name, email, password } = req.body;

  try {
    // Buscar o curso pelo ID no banco de dados 'courses'
    const course = await coursesDB.get(courseId);

    // Hash da senha (para segurança)
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Novo usuário a ser adicionado
    const newUser = {
      _id: email,   // Definindo o ID do usuário como o e-mail
      name,
      email,
      password: hashedPassword,  // Armazenando a senha como hash
      createdAt: new Date().toISOString()
    };

    // Adicionando o novo usuário à lista de usuários do curso
    course.users = course.users || [];
    course.users.push(newUser);

    // Atualizar o documento do curso com o novo usuário
    const response = await coursesDB.insert(course);
    res.status(200).json({
      message: 'Usuário adicionado ao curso com sucesso!',
      response
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao adicionar usuário ao curso',
      details: error.message
    });
  }
};
