USE tseDB;
SET NAMES utf9mb4;
------------- Creating model------------------------------------

  --departamentos
CREATE TABLE IF NOT EXISTS departamentos(
    id_departamento INTEGER NOT NULL,
    nombre VARCHAR(50) NOT NULL)
    DEFAULT CHARACTER SET=utf8mb4;


ALTER TABLE departamentos
ADD CONSTRAINT PK_departamentos PRIMARY KEY(id_departamento);

  --mesas

CREATE TABLE IF NOT EXISTS mesas(
    id_mesa INTEGER NOT NULL,
    id_departamento INTEGER NOT NULL    
);

ALTER TABLE mesas
ADD CONSTRAINT PK_mesas PRIMARY KEY(id_mesa);

ALTER TABLE mesas
ADD CONSTRAINT FK_mesadep FOREIGN KEY(id_departamento) REFERENCES departamentos(id_departamento);

  --partidos 

CREATE TABLE IF NOT EXISTS partidos(
    id_partido INTEGER NOT NULL,
    nombre_partido VARCHAR (50) NOT NULL,
    siglas VARCHAR(30) NOT NULL,
    fundacion DATE NOT NULL
);


ALTER TABLE partidos
ADD CONSTRAINT PK_partidos PRIMARY KEY(id_partido);

  --cargos

CREATE TABLE IF NOT EXISTS cargos(
    id_cargo INTEGER NOT NULL,
    cargo  VARCHAR (50) NOT NULL
);

ALTER TABLE cargos
ADD CONSTRAINT PK_cargos PRIMARY KEY(id_cargo);



CREATE TABLE IF NOT EXISTS candidatos(
    id_candidato INTEGER NOT NULL,
    nombre VARCHAR(60) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    id_partido INTEGER NOT NULL,
    id_cargo INTEGER NOT NULL
);

ALTER TABLE candidatos
ADD CONSTRAINT PK_candidatos PRIMARY KEY(id_candidato);

ALTER TABLE candidatos
ADD CONSTRAINT FK_candpartido FOREIGN KEY(id_partido) REFERENCES partidos(id_partido);

ALTER TABLE candidatos
ADD CONSTRAINT FK_candcargo FOREIGN KEY(id_cargo) REFERENCES cargos(id_cargo);


CREATE TABLE IF NOT EXISTS ciudadanos(
    dpi VARCHAR(13) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    direccion VARCHAR(60) NOT NULL,
    telefono VARCHAR(10) NOT NULL,
    edad  TINYINT NOT NULL,
    genero CHAR(1) NOT NULL
);
ALTER TABLE ciudadanos
ADD CONSTRAINT PK_ciudadanos PRIMARY KEY(dpi);

CREATE TABLE IF NOT EXISTS votos(
    id_voto INTEGER NOT NULL,
    dpi VARCHAR(13) NOT NULL,
    id_mesa INTEGER NOT NULL,
    fecha_hora DATETIME NOT NULL
);

ALTER TABLE votos
ADD CONSTRAINT PK_votos PRIMARY KEY(id_voto);



ALTER TABLE votos
ADD CONSTRAINT FK_votosciud FOREIGN KEY(dpi) REFERENCES ciudadanos(dpi);

ALTER TABLE votos
ADD CONSTRAINT FK_votosmesa FOREIGN KEY(id_mesa) REFERENCES mesas(id_mesa);


CREATE TABLE IF NOT EXISTS voto_detalles(
    id_voto_det INTEGER NOT NULL AUTO_INCREMENT,
    id_voto INTEGER NOT NULL,
    id_candidato INTEGER NOT NULL,
    PRIMARY KEY (id_voto_det)  
);

ALTER TABLE voto_detalles
ADD CONSTRAINT PK_voto_detalles PRIMARY KEY(id_voto_det);

ALTER TABLE voto_detalles
ADD CONSTRAINT FK_vdetalles_voto FOREIGN KEY(id_voto) REFERENCES votos(id_voto);

ALTER TABLE voto_detalles
ADD CONSTRAINT FK_vdetalles_cand FOREIGN KEY(id_candidato) REFERENCES candidatos(id_candidato);


-----------------------------------------------------Creating temporary tables-----------------------

CREATE TEMPORARY TABLE IF NOT EXISTS tempdepartamentos(
    id_departamento INTEGER NOT NULL,
    nombre VARCHAR(50) NOT NULL
);

CREATE TEMPORARY TABLE IF NOT EXISTS tempmesas(
    id_mesa INTEGER NOT NULL,
    id_departamento INTEGER NOT NULL    
);


CREATE TEMPORARY TABLE IF NOT EXISTS temppartidos(
    id_partido INTEGER NOT NULL,
    nombre_partido VARCHAR (50) NOT NULL,
    siglas VARCHAR(30) NOT NULL,
    fundacion DATE NOT NULL
);


CREATE TEMPORARY TABLE IF NOT EXISTS tempcargos(
    id_cargo INTEGER NOT NULL,
    cargo  VARCHAR (50) NOT NULL
);

CREATE  TEMPORARY TABLE IF NOT EXISTS tempcandidatos(
    id_candidato INTEGER NOT NULL,
    nombre VARCHAR(60) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    id_partido INTEGER NOT NULL,
    id_cargo INTEGER NOT NULL
);

CREATE TEMPORARY TABLE IF NOT EXISTS tempciudadanos(
    dpi VARCHAR(13) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    direccion VARCHAR(60) NOT NULL,
    telefono VARCHAR(10) NOT NULL,
    edad  TINYINT NOT NULL,
    genero CHAR(1) NOT NULL
);


CREATE TEMPORARY TABLE IF NOT EXISTS tempvotos(
    id_voto INTEGER NOT NULL,
    id_candidato INTEGER NOT NULL,
    dpi VARCHAR(13) NOT NULL,
    id_mesa INTEGER NOT NULL,
    fecha_hora DATETIME NOT NULL
);



INSERT INTO departamentos TABLE  tempdepartamentos;

INSERT INTO mesas TABLE tempmesas;

INSERT INTO  partidos TABLE temppartidos;

INSERT INTO  cargos TABLE tempcargos;

INSERT INTO  candidatos TABLE tempcandidatos;

INSERT INTO  ciudadanos TABLE tempciudadanos;

INSERT IGNORE INTO  votos(id_voto,dpi,id_mesa,fecha_hora) SELECT id_voto,dpi,id_mesa,fecha_hora FROM tempvotos;

INSERT INTO  voto_detalles(id_voto,id_candidato) SELECT id_voto,id_candidato FROM tempvotos;

------------------- Eliminating model ------------------------------------
DROP TABLE IF EXISTS voto_detalles;
 
DROP TABLE IF EXISTS votos;
           
DROP TABLE IF EXISTS candidatos;

DROP TABLE IF EXISTS partidos;

DROP TABLE IF EXISTS cargos;

DROP TABLE IF EXISTS ciudadanos;

DROP TABLE IF EXISTS mesas;

DROP TABLE IF EXISTS departamentos; 


---------------------- REPORTS--------------------------

# CONSULTA 1

SELECT can.nombre AS Presidente,can2.nombre AS Vicepresidente, partidos.nombre_partido AS Partido 
FROM candidatos can 
INNER JOIN partidos ON partidos.id_partido=can.id_partido AND can.id_cargo=1 
INNER JOIN candidatos can2 ON can2.id_cargo=2 AND can2.id_partido=partidos.id_partido;

# CONSULTA 2

SELECT COUNT(can.id_candidato) AS 'Cantidad de diputados', partidos.nombre_partido AS Partido 
FROM candidatos can 
INNER JOIN partidos ON partidos.id_partido=can.id_partido AND (can.id_cargo=3 OR can.id_cargo=4 OR can.id_cargo=5) 
GROUP BY Partido
ORDER BY COUNT(can.id_candidato) DESC ; 


# CONSULTA 3

SELECT can.nombre AS Alcalde, partidos.nombre_partido AS Partido 
FROM candidatos can INNER JOIN partidos ON partidos.id_partido=can.id_partido AND can.id_cargo=6 

# CONSULTA 4

SELECT COUNT(can.id_candidato) AS 'Cantidad de candidatos', partidos.nombre_partido AS Partido 
FROM candidatos can 
INNER JOIN partidos ON partidos.id_partido=can.id_partido AND (can.id_cargo=3 OR can.id_cargo=4 OR can.id_cargo=5 OR can.id_cargo=6 OR can.id_cargo=1 OR can.id_cargo=2) 
GROUP BY Partido
ORDER BY COUNT(can.id_candidato) DESC ;

# CONSULTA 5

SELECT COUNT(votos.id_voto) AS 'Cantidad de votos', departamentos.nombre AS 'Departamento'
FROM votos  
INNER JOIN mesas ON votos.id_mesa=mesas.id_mesa
INNER JOIN departamentos ON mesas.id_departamento=departamentos.id_departamento
GROUP BY Departamento
ORDER BY COUNT(votos.id_voto) DESC ; 

# CONSULTA 6

SELECT COUNT(DISTINCT votos.id_voto) AS 'Cantidad de votos nulos'
FROM votos 
INNER JOIN voto_detalles ON votos.id_voto=voto_detalles.id_voto and voto_detalles.id_candidato=-1;

# CONSULTA 7

SELECT COUNT(votos.id_voto) AS 'Cantidad de votos' , ciudadanos.edad AS 'Edad de ciudadano'
FROM votos 
INNER JOIN ciudadanos ON votos.dpi=ciudadanos.dpi 
GROUP BY ciudadanos.edad
ORDER BY COUNT(votos.id_voto) DESC LIMIT 10;

# CONSULTA 8

SELECT can1.nombre AS 'Presidente',can2.nombre AS 'Vicepresidente' ,COUNT(votos.id_voto) AS 'Cantidad de votos'
FROM votos
INNER JOIN voto_detalles v1 ON votos.id_voto=v1.id_voto and v1.id_candidato<>-1
INNER JOIN candidatos can1 ON v1.id_candidato=can1.id_candidato and can1.id_cargo=1
INNER JOIN candidatos can2 ON can1.id_partido=can2.id_partido and can2.id_cargo=2
GROUP BY can1.nombre,can2.nombre
ORDER BY COUNT(votos.id_voto) DESC;

# CONSULTA 9
SELECT COUNT(votos.id_voto) AS 'Cantidad de votos',mesas.id_mesa AS 'Numero de mesa', departamentos.nombre AS 'Departamento'
FROM votos INNER JOIN mesas ON votos.id_mesa=mesas.id_mesa 
INNER JOIN departamentos ON
departamentos.id_departamento=mesas.id_departamento
GROUP BY  mesas.id_mesa, departamentos.nombre
ORDER BY  COUNT(votos.id_voto) DESC LIMIT 5;

# CONSULTA 10

SELECT TIME(votos.fecha_hora) AS 'Hora', COUNT(votos.id_voto) AS 'Cantidad de votos'
FROM votos
GROUP BY Hora
ORDER BY COUNT(votos.id_voto) DESC 
LIMIT 5;

# CONSULTA 11
SELECT ciudadanos.genero AS 'Genero', COUNT(votos.id_voto) AS 'Cantidad de votos'
FROM votos
INNER JOIN ciudadanos ON votos.dpi=ciudadanos.dpi
GROUP BY  ciudadanos.genero
ORDER BY COUNT(votos.id_voto)
DESC
;