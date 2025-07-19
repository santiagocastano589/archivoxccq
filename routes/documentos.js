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

router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT id, nombre_archivo, ruta, estado, usuario_subio, fecha_subida
      FROM Documentos
      ORDER BY fecha_subida DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error al obtener documentos:', err);
    res.status(500).json({ error: 'Error al consultar documentos' });
  }
});


router.post('/subir', upload.single('archivo'), async (req, res) => {
  const archivo = req.file;
  const usuario = req.body.usuario;

  if (!archivo || !usuario) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('nombre_archivo', archivo.originalname)
      .input('ruta', `/uploads/${archivo.filename}`)
      .input('usuario_subio', usuario)
      .query(`
        INSERT INTO Documentos (nombre_archivo, ruta, usuario_subio)
        VALUES (@nombre_archivo, @ruta, @usuario_subio)
      `);

    res.json({ mensaje: '✅ Documento guardado exitosamente' });
  } catch (err) {
    console.error('❌ Error al guardar documento:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.post('/reenviar', async (req, res) => {
  const { id_documento, nuevo_usuario, nueva_area, firmado_por } = req.body;

  try {
    const pool = await poolPromise;

    // Actualiza documento
    await pool.request()
      .input('id_documento', id_documento)
      .input('area_actual', nueva_area)
      .input('firmado_por', firmado_por)
      .input('firmado_fecha', new Date())
      .query(`
        UPDATE Documentos
        SET area_actual = @area_actual,
            firmado_por = @firmado_por,
            firmado_fecha = @firmado_fecha,
            estado = 'Enviado'
        WHERE id = @id_documento
      `);

    // Historial
    await pool.request()
      .input('id_documento', id_documento)
      .input('usuario', firmado_por)
      .input('area', nueva_area)
      .input('accion', 'REENVIADO')
      .input('observaciones', `Documento reenviado por ${firmado_por}`)
      .query(`
        INSERT INTO HistorialDocumentos (id_documento, usuario, area, accion, observaciones)
        VALUES (@id_documento, @usuario, @area, @accion, @observaciones)
      `);

    res.json({ mensaje: '✅ Documento reenviado y firmado automáticamente.' });
  } catch (err) {
    console.error('❌ Error al reenviar documento:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.post('/compartir', async (req, res) => {
  const { id_documento, de_usuario, para_usuario, firma } = req.body;

  try {
    const pool = await poolPromise;

    await pool.request()
      .input('id_documento', id_documento)
      .input('de_usuario', de_usuario)
      .input('para_usuario', para_usuario)
      .input('firma', firma)
      .query(`
        INSERT INTO Documentos_Compartidos (id_documento, de_usuario, para_usuario, firma)
        VALUES (@id_documento, @de_usuario, @para_usuario, @firma)
      `);

    res.json({ mensaje: '✅ Documento compartido exitosamente.' });
  } catch (err) {
    console.error('Error al compartir documento:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.get('/compartidos-conmigo/:usuario', async (req, res) => {
  const usuario = req.params.usuario;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('usuario', usuario)
      .query(`
        SELECT d.id, d.nombre_archivo, dc.estado, dc.firma, dc.de_usuario, dc.fecha
        FROM Documentos d
        INNER JOIN Documentos_Compartidos dc ON d.id = dc.id_documento
        WHERE dc.para_usuario = @usuario
        ORDER BY dc.fecha DESC
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener documentos compartidos:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});



router.get('/mis-documentos/:usuario', async (req, res) => {
  const usuario = req.params.usuario;

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('usuario', usuario)
      .query(`
        SELECT * FROM Documentos
        WHERE usuario_subio = @usuario
        ORDER BY fecha_subida DESC
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener mis documentos:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});



module.exports = router;
