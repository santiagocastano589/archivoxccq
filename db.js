const sql = require('mssql');

const config = {
  user: 'pruebas',
  password: 'CCQPrueb@s6',
  server: '172.30.0.6',
  database: 'HOSVITAL_FE',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};
// const config = {
//   user: 'sa',
//   password: '12345',
//   server: '127.0.0.1',
//   database: 'DocumentosDB',
//   options: {
//     encrypt: false,
//     trustServerCertificate: true
//   }
// };

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('✅ Conectado a SQL Server');
    return pool;
  })
  .catch(err => console.error('❌ Error de conexión:', err));

module.exports = {
  sql,
  poolPromise
};
