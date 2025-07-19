const { poolPromise } = require('../db');

exports.getUsuarios = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Usuarios');
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error en consulta:', err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};


exports.login = async (req, res) => {
  const { usuario, clave } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('usuario', usuario)
      .input('clave', clave)
      .query('SELECT nombre FROM Usuarios WHERE usuario = @usuario AND clave = @clave');

    if (result.recordset.length > 0) {
      res.json({ nombre: result.recordset[0].nombre });
    } else {
      res.status(401).json({ error: 'Usuario o clave incorrectos' });
    }
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
