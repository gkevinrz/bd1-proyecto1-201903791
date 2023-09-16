USE tseDB;
------------- Creating model------------------------------------

  --departamentos
CREATE TABLE IF NOT EXISTS departamentos(
    id_departamento INTEGER NOT NULL,
    nombre VARCHAR(50) NOT NULL
);

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


---------------------- REPORTS --------------------------------------------