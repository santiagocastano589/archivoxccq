const express = require('express');
const router = express.Router();
const { poolPromise } = require('../db'); // asegúrate que la ruta a db.js sea correcta

router.post('/', async (req, res) => {
  const { usuario, clave } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('usuario', usuario)
      .input('clave', clave)
      .query('SELECT * FROM Usuarios WHERE usuario = @usuario AND clave = @clave');

    if (result.recordset.length > 0) {
      res.json({ success: true, usuario: result.recordset[0] });
    } else {
      res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

module.exports = router;
