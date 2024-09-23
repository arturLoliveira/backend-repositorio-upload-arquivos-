const coursesDB = require('../db/couch');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.addUserToCourse = async (req, res) => {
  const { courseId } = req.params;
  const { name, email, password } = req.body;


  try {
    const course = await coursesDB.get(courseId);

    // console.log(course)

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      _id: email,   
      name,
      email,
      password: hashedPassword,  
      createdAt: new Date().toISOString(),
      course_id: courseId
    };

    await coursesDB.insert(newUser)
    // if (!course.users) {
    //   course.users = [];
    // }
    course.users.push(newUser._id);
    await coursesDB.insert(course);

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
exports.login = async (req, res) => {
  const { email, password } = req.body;
 console.log(email, password)
 const user = await coursesDB.get(email, password);
  try {
    const user = await coursesDB.get(email);

    console.log(user)

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    console.log(user.password)

    if (!isMatch) {
      return res.status(400).json({ message: 'Senha incorreta' });
    }
    const token = jwt.sign({ userId: user._id, email: user.email }, 'secreta', { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao fazer login',
      details: error.message
    });
  }
};

exports.protect = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Usando optional chaining
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
