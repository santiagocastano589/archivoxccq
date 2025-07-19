const express = require('express');
const path = require('path');
const app = express();

const loginRoutes = require('./routes/login');
const documentosRoutes = require('./routes/documentos');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/documentos', documentosRoutes);
app.use('/login', loginRoutes);



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`);
});
