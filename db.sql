-- Base de datos
CREATE DATABASE DocumentosDB;
GO
USE DocumentosDB;
GO

-- Tabla de usuarios
CREATE TABLE Usuarios (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100),
    usuario NVARCHAR(50) UNIQUE,
    clave NVARCHAR(255) -- puede estar cifrada
);

ALTER TABLE Usuarios
ADD area_id INT FOREIGN KEY REFERENCES Areas(id);

GO

drop table Usuarios

-- Usuario de prueba
INSERT INTO Usuarios (nombre, usuario, clave)
VALUES ('Santiago Castaño', 'admin', '12345');

INSERT INTO Usuarios (nombre, usuario, clave)
VALUES ('prueba', 'user', '12345');
GO

select * from Usuarios;

CREATE TABLE Documentos (
  id INT IDENTITY(1,1) PRIMARY KEY,
  nombre_archivo NVARCHAR(255),
  ruta NVARCHAR(255),
  estado NVARCHAR(50) DEFAULT 'Pendiente',
  usuario_subio NVARCHAR(100),
  fecha_subida DATETIME DEFAULT GETDATE()
);
ALTER TABLE Documentos
ADD area_actual NVARCHAR(100),
    firmado_por NVARCHAR(100),
    firmado_fecha DATETIME,
    observaciones NVARCHAR(MAX)


select * from Documentos;

CREATE TABLE HistorialDocumentos (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_documento INT,
  usuario NVARCHAR(100),
  area NVARCHAR(100),
  accion NVARCHAR(100), -- ejemplo: ENVIADO, RECHAZADO, APROBADO
  fecha DATETIME DEFAULT GETDATE(),
  observaciones NVARCHAR(MAX)
);
select * from HistorialDocumentos;

CREATE TABLE Documentos_Compartidos (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_documento INT,
  de_usuario NVARCHAR(100),
  para_usuario NVARCHAR(100),
  firma NVARCHAR(100), -- opcional: URL de la firma o texto
  estado NVARCHAR(50) DEFAULT 'Pendiente',
  fecha DATETIME DEFAULT GETDATE()
);

select * from Documentos_Compartidos;

CREATE TABLE Areas (
  id INT IDENTITY(1,1) PRIMARY KEY,
  nombre NVARCHAR(100) UNIQUE
);
INSERT INTO Areas (nombre) VALUES 
('Recepción'), ('Archivo'), ('Gerencia'), ('Jurídica'), ('Calidad');

select * from Areas;