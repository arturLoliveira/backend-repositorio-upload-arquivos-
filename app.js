const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
// Middlewares e rotas
app.use(bodyParser.json());
app.use(cors());

// Expondo a pasta 'uploads' publicamente
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas (inclua as suas rotas aqui)
const subjectRoutes = require('./routes/subjectRoutes');
const courseRoutes = require('./routes/courseRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(subjectRoutes);
app.use(courseRoutes);
app.use(authRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
