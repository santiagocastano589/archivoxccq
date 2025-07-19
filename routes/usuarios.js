// routes/usuarios.js
const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

router.get('/', usuariosController.getUsuarios);
// routes/usuarios.js

router.post('/login', usuariosController.login);


module.exports = router;
