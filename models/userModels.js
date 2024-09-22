
const coursesDB = require('../db/couch');
const bcrypt = require('bcryptjs');

// Função para criar um novo usuário
exports.createUser = async (userData) => {
  // Gerar o hash da senha
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  // Definir o documento de usuário
  const userDoc = {
    _id: userData.username, // O _id será o nome do usuário
    username: userData.username,
    email: userData.email,
    password: hashedPassword, // Senha criptografada
    createdAt: new Date().toISOString() // Data de criação
  };

  try {
    // Inserir o documento no banco de dados CouchDB
    const result = await coursesDB.insert(userDoc);
    console.log('Usuário criado com sucesso:', result);
    return result;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw new Error('Erro ao criar usuário no CouchDB');
  }
};
