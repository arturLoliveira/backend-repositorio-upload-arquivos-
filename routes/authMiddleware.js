const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

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
