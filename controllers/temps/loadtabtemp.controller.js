import mysql from 'mysql2/promise'  
import config from 'config'
import {parseFile} from 'fast-csv'

export const loadtemptable=async (req, res) => {

    try {
        const connection = await mysql.createConnection(config.get('database'));
        const queries = [
            `
        CREATE TEMPORARY TABLE IF NOT EXISTS tempdepartamentos(
            id_departamento INTEGER NOT NULL,
            nombre VARCHAR(50) NOT NULL
        )
        DEFAULT CHARACTER SET = utf8mb4;
        ;
        `,

            `
        CREATE TEMPORARY TABLE IF NOT EXISTS tempmesas(
            id_mesa INTEGER NOT NULL,
            id_departamento INTEGER NOT NULL    
        );
        `,

            `
        CREATE TEMPORARY TABLE IF NOT EXISTS temppartidos(
            id_partido INTEGER NOT NULL,
            nombre_partido VARCHAR (50) NOT NULL,
            siglas VARCHAR(30) NOT NULL,
            fundacion DATE NOT NULL
        );
        `,

        `
        CREATE TEMPORARY TABLE IF NOT EXISTS tempcargos(
            id_cargo INTEGER NOT NULL,
            cargo  VARCHAR (50) NOT NULL
        );
        `,

            `
        CREATE  TEMPORARY TABLE IF NOT EXISTS tempcandidatos(
            id_candidato INTEGER NOT NULL,
            nombre VARCHAR(100) NOT NULL,
            fecha_nacimiento DATE NOT NULL,
            id_partido INTEGER NOT NULL,
            id_cargo INTEGER NOT NULL
        );
        `,

            `
        CREATE TEMPORARY TABLE IF NOT EXISTS tempciudadanos(
            dpi VARCHAR(13) NOT NULL,
            nombre VARCHAR(50) NOT NULL,
            apellido VARCHAR(50) NOT NULL,
            direccion VARCHAR(60) NOT NULL,
            telefono VARCHAR(10) NOT NULL,
            edad  TINYINT NOT NULL,
            genero CHAR(1) NOT NULL
        );
        `,

            `CREATE TEMPORARY TABLE IF NOT EXISTS tempvotos(
            id_voto INTEGER NOT NULL,
            id_candidato INTEGER NOT NULL,
            dpi VARCHAR(13) NOT NULL,
            id_mesa INTEGER NOT NULL,
            fecha_hora DATETIME NOT NULL
        );
        `
        ];
        for (let i = 0; i < queries.length; i++) {
            await connection.query(queries[i]);

        }
        const depas=[];
        const mesas=[];
        const partidos=[];
        const cargos=[];
        const candidatos=[];
        const ciudadanos=[];
        const votos=[];

        const csvDeps = new Promise((resolve, reject) => {
            parseFile('utils/entradas/departamentos.csv', { skipRows: 1, encoding:'utf8'})
              .on('error', error => reject(error))
              .on('data', row => depas.push(row))
              .on('end', () => resolve(depas));
        }); 

        const csvMesas = new Promise((resolve, reject) => {
            parseFile('utils/entradas/mesas.csv', { skipRows: 1, encoding:'utf8'})
              .on('error', error => reject(error))
              .on('data', row => mesas.push(row))
              .on('end', () => resolve(mesas));
        }); 

        const csvPartidos = new Promise((resolve, reject) => {
            parseFile('utils/entradas/partidos.csv', { skipRows: 1, encoding:'utf8'})
              .on('error', error => reject(error))
              .on('data', row => partidos.push(row))
              .on('end', () => resolve(partidos));
        }); 

        const csvCargos = new Promise((resolve, reject) => {
            parseFile('utils/entradas/cargos.csv', { skipRows: 1, encoding:'utf8'})
              .on('error', error => reject(error))
              .on('data', row => cargos.push(row))
              .on('end', () => resolve(cargos));
        }); 

        const csvCandidatos = new Promise((resolve, reject) => {
            parseFile('utils/entradas/candidatos.csv', { skipRows: 1, encoding:'utf8'})
              .on('error', error => reject(error))
              .on('data', row => candidatos.push(row))
              .on('end', () => resolve(candidatos));
        });
        
        const csvCiudadanos = new Promise((resolve, reject) => {
            parseFile('utils/entradas/ciudadanos.csv', { skipRows: 1, encoding:'utf8'})
              .on('error', error => reject(error))
              .on('data', row => ciudadanos.push(row))
              .on('end', () => resolve(ciudadanos));
        });

        const csvVotos  = new Promise((resolve, reject) => {
            parseFile('utils/entradas/votaciones.csv', { skipRows: 1, encoding:'utf8'})
              .on('error', error => reject(error))
              .on('data', row => votos.push(row))
              .on('end', () => resolve(votos));
        });



        /* DEPARTAMENTOS */
        const depasData = await csvDeps;       
        for (let i = 0; i < depasData.length; i++) {
            await connection.query(
            `
            INSERT INTO tempdepartamentos(id_departamento,nombre) VALUES (${parseInt(depasData[i][0])},'${depasData[i][1]}');
             `
            );
        }
        await connection.query(`INSERT INTO  departamentos TABLE tempdepartamentos;`);

        /* MESAS */
        const mesasData = await csvMesas;       
        for (let i = 0; i < mesasData.length; i++) {
            await connection.query(
            `
            INSERT INTO tempmesas(id_mesa,id_departamento) VALUES (${parseInt(mesasData[i][0])},'${parseInt(mesasData[i][1])}');
             `
            );
        }
        await connection.query(`INSERT INTO  mesas TABLE tempmesas;`);
        /* Partidos */
        const partidosData = await csvPartidos;       
        for (let i = 0; i < partidosData.length; i++) {
            let tmpdate= partidosData[i][3].split('/');
            await connection.query(
            `
            INSERT INTO temppartidos(id_partido,nombre_partido,siglas,fundacion) VALUES (${parseInt(partidosData[i][0])},'${partidosData[i][1]}','${partidosData[i][2]}','${tmpdate[2]}-${tmpdate[1]}-${tmpdate[0]}');
             `
            );
        }
        await connection.query(`INSERT INTO  partidos TABLE temppartidos;`);

        /* CARGOS */
        const cargosData = await csvCargos;       
        for (let i = 0; i < cargosData.length; i++) {
            await connection.query(
            `
            INSERT INTO tempcargos(id_cargo,cargo) VALUES (${parseInt(cargosData[i][0])},'${cargosData[i][1]}');
             `
            );
        }
        await connection.query(`INSERT INTO  cargos TABLE tempcargos;`);
        
        /* CANDIDATOS */
        const candidatosData = await csvCandidatos;  
        for (let i = 0; i < candidatosData.length; i++) {
            let tmpdate= candidatosData[i][2].split('/');
            await connection.query(
            `
            INSERT INTO tempcandidatos(id_candidato,nombre,fecha_nacimiento,id_partido,id_cargo) VALUES (${parseInt(candidatosData[i][0])},"${candidatosData[i][1]}",'${tmpdate[2]}-${tmpdate[1]}-${tmpdate[0]}',${parseInt(candidatosData[i][3])},${parseInt(candidatosData[i][4])});
             `
            );
        }
        await connection.query(`INSERT INTO  candidatos TABLE tempcandidatos;`);
        /* CIUDADANOS */
        const ciudadanosData = await csvCiudadanos;  
        for (let i = 0; i < ciudadanosData.length; i++) {
            await connection.query(
            `
            INSERT INTO tempciudadanos(dpi,nombre,apellido,direccion,telefono,edad,genero) VALUES ('${ciudadanosData[i][0]}',"${ciudadanosData[i][1]}","${ciudadanosData[i][2]}","${ciudadanosData[i][3]}",'${ciudadanosData[i][4]}',${parseInt(ciudadanosData[i][5])},'${ciudadanosData[i][6]}');
             `
            );
        }         
        await connection.query(`INSERT INTO  ciudadanos TABLE tempciudadanos;`);
        /* VOTOS */
        const votosData = await csvVotos;  
        for (let i = 0; i < votosData.length; i++) {
            let spaces=votosData[i][4].split(' ');
            let tmpdate= spaces[0].split('/');
            await connection.query(
            `
            INSERT INTO tempvotos(id_voto,id_candidato,dpi,id_mesa,fecha_hora) VALUES (${parseInt(votosData[i][0])},${parseInt(votosData[i][1])},'${votosData[i][2]}',${parseInt(votosData[i][3])},'${tmpdate[2]}-${tmpdate[1]}-${tmpdate[0]} ${spaces[1]}:00');
             `
            );
        } 

        await connection.query(`
        INSERT IGNORE INTO  votos(id_voto,dpi,id_mesa,fecha_hora) SELECT id_voto,dpi,id_mesa,fecha_hora FROM tempvotos;
        
        `);
        await connection.query(`
        INSERT INTO  voto_detalles(id_voto,id_candidato) SELECT id_voto,id_candidato FROM tempvotos;
        `);


        await connection.end();
                            
    
        res.status(200).json({
            body: { title: 'Tablas temporales', message: 'Carga realizada correctamente' },
        });

    } catch (error) {
        res.status(500).send({ "title": "Ocurrio un error al cargar tablas", error });
    }

};

            


