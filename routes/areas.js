const express = require('express');
const multer = require('multer');
const path = require('path');
const { poolPromise } = require('../db');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const nombreFinal = Date.now() + '-' + file.originalname;
    cb(null, nombreFinal);
  }
});

const upload = multer({ storage: storage });

router.get('/areas', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT id, nombre FROM Areas');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener áreas:', err);
    res.status(500).json({ error: 'Error al consultar áreas' });
  }
});



router.get('/usuarios-por-area/:area_id', async (req, res) => {
  const area_id = req.params.area_id;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('area_id', area_id)
      .query('SELECT id, nombre FROM Usuarios WHERE area_id = @area_id');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    res.status(500).json({ error: 'Error al consultar usuarios' });
  }
});






module.exports = router;
