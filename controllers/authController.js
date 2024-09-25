const coursesDB = require('../db/couch');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
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
  const token = req.header('Authorization')?.replace('Bearer ', '');
  const decoded = jwt.verify(token, 'secreta'); 

  req.user = decoded;
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso restrito a administradores' });
  }
  console.log(req.user.role)
  next();
};

exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;


  try {
      const user = await coursesDB.get(email);
      if (!user) {
          return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const tokenExpiration = Date.now() + 3600000; 

      user.resetToken = resetToken;
      user.resetTokenExpiration = tokenExpiration;
      await coursesDB.insert(user);

      const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              user: 'dearquivosarmazenamento@gmail.com',
              pass: 'swdr cwms hzjo rped',
          },
      });

      const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

      await transporter.sendMail({
          to: email,
          from: 'arturlinhares2001@gmail.com',
          subject: 'Recuperação de senha',
          html: `
              <p>Você solicitou a recuperação de senha.</p>
              <p>Clique no link abaixo para redefinir sua senha:</p>
              <a href="${resetLink}">Redefinir Senha</a>
          `,
      });

      res.status(200).json({ message: 'Email de recuperação enviado.' });
  } catch (error) {
      console.error('Erro ao solicitar recuperação de senha:', error);
      res.status(500).json({ error: 'Erro ao solicitar recuperação de senha' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params; 
  const { password, email } = req.body;
  console.log(email, password)


  try {
    const user = await coursesDB.get(email); 
    if (!user || user.resetToken !== token || user.resetTokenExpiration < Date.now()) {
        return res.status(400).json({ error: 'Token inválido ou expirado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    delete user.resetToken;
    delete user.resetTokenExpiration;
    await coursesDB.insert(user);

    res.status(200).json({ message: 'Senha redefinida com sucesso!' });
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    res.status(500).json({ error: 'Erro ao redefinir senha' });
  }
};
