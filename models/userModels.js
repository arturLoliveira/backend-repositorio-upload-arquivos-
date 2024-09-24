const coursesDB = require('../db/couch');
const bcrypt = require('bcryptjs');

exports.createUser = async (userData) => {

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  const userDoc = {
    _id: userData.username, 
    username: userData.username,
    email: userData.email,
    password: hashedPassword,
    createdAt: new Date().toISOString() 
  };

  try {
    const result = await coursesDB.insert(userDoc);
    console.log('Usuário criado com sucesso:', result);
    return result;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw new Error('Erro ao criar usuário no CouchDB');
  }
};
