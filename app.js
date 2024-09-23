const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



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
