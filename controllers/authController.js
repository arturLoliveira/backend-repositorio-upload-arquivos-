const coursesDB = require('../db/couch');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.addUserToCourse = async (req, res) => {
  const { courseId } = req.params;
  const { name, email, password, role } = req.body; 

  try {
    const course = await coursesDB.get(courseId);
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      _id: email,   
      name,
      email,
      password: hashedPassword,
      role: role || 'user', 
      createdAt: new Date().toISOString(),
      course_id: courseId
    };

    await coursesDB.insert(newUser);

    if (!course.users) {
      course.users = [];
    }
    course.users.push(newUser._id);
    await coursesDB.insert(course);

    res.status(200).json({
      message: 'Usuário adicionado ao curso com sucesso!',
      newUser
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao adicionar usuário ao curso',
      details: error.message
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await coursesDB.get(email);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Senha incorreta' });
    }

    const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, 'secreta', { expiresIn: '1h' });

    res.status(200).json({ token, role: user.role }); 
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao fazer login',
      details: error.message
    });
  }
};

exports.protect = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log(req)
  if (!token) {
    return res.status(401).json({ error: 'Acesso negado' });
  }

  try {
    const decoded = jwt.verify(token, 'secreta');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

exports.adminProtect = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  const decoded = jwt.verify(token, 'secreta'); 

  req.user = decoded;
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso restrito a administradores' });
  }
  console.log(req.user.role)
  next();
};
