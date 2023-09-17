import mysql from 'mysql2/promise'  
import config from 'config'


export const query1=async (req,res)=>{
    try {
        const connection=await mysql.createConnection(config.get('database'));
        
        const query1=await connection.query(`

        SELECT can.nombre AS Presidente,can2.nombre AS Vicepresidente, partidos.nombre_partido AS Partido 
        FROM candidatos can 
        INNER JOIN partidos ON partidos.id_partido=can.id_partido AND can.id_cargo=1 
        INNER JOIN candidatos can2 ON can2.id_cargo=2 AND can2.id_partido=partidos.id_partido;
        
        `);
        console.log(query1[0]);


        await connection.end();
        res.status(200).json({
            body: { title: 'Consulta 1', data: query1[0] },
        }); 
    } catch (error) {
        res.status(500).send({"title":"Ocurrió un erro en la Consulta 2",error});
    }

}




export const query2=async (req,res)=>{
    try {
        const connection=await mysql.createConnection(config.get('database'));
        
        const query2=await connection.query(`
        SELECT COUNT(can.id_candidato) AS 'Cantidad de diputados', partidos.nombre_partido AS Partido 
        FROM candidatos can 
        INNER JOIN partidos ON partidos.id_partido=can.id_partido AND (can.id_cargo=3 OR can.id_cargo=4 OR can.id_cargo=5) 
        GROUP BY Partido
        ORDER BY COUNT(can.id_candidato) DESC ; 
        `);


        await connection.end();
        res.status(200).json({
            body: { title: 'Consulta 2', data: query2[0] },
        }); 
    } catch (error) {
        res.status(500).send({"title":"Ocurrió un erro en la Consulta 1",error});
    }
}


export const query3=async (req,res)=>{
    try {
        const connection=await mysql.createConnection(config.get('database'));
        
        const query3=await connection.query(`

        SELECT can.nombre AS Alcalde, partidos.nombre_partido AS Partido 
        FROM candidatos can INNER JOIN partidos ON partidos.id_partido=can.id_partido AND can.id_cargo=6 
        
        `);


        await connection.end();
        res.status(200).json({
            body: { title: 'Consulta 3', data: query3[0] },
        }); 
    } catch (error) {
        res.status(500).send({"title":"Ocurrió un erro en la Consulta 3",error});
    }
}


export const query4=async (req,res)=>{
    try {
        const connection=await mysql.createConnection(config.get('database'));
        
        const query4=await connection.query(`
        SELECT COUNT(can.id_candidato) AS 'Cantidad de candidatos', partidos.nombre_partido AS Partido 
        FROM candidatos can 
        INNER JOIN partidos ON partidos.id_partido=can.id_partido AND (can.id_cargo=3 OR can.id_cargo=4 OR can.id_cargo=5 OR can.id_cargo=6 OR can.id_cargo=1 OR can.id_cargo=2) 
        GROUP BY Partido
        ORDER BY COUNT(can.id_candidato) DESC ; 

        `);


        await connection.end();
        res.status(200).json({
            body: { title: 'Consulta 4', data: query4[0] },
        }); 
    } catch (error) {
        res.status(500).send({"title":"Ocurrió un erro en la Consulta 4",error});
    }
}
export const query5=async (req,res)=>{
    try {
        const connection=await mysql.createConnection(config.get('database'));
        
        const query5=await connection.query(`
        SELECT COUNT(votos.id_voto) AS 'Cantidad de votos', departamentos.nombre AS 'Departamento'
        FROM votos  
        INNER JOIN mesas ON votos.id_mesa=mesas.id_mesa
        INNER JOIN departamentos ON mesas.id_departamento=departamentos.id_departamento
         GROUP BY Departamento
         ORDER BY COUNT(votos.id_voto) DESC ; 

        `);


        await connection.end();
        res.status(200).json({
            body: { title: 'Consulta 5', data: query5[0] },
        }); 
    } catch (error) {
        res.status(500).send({"title":"Ocurrió un erro en la Consulta 5",error});
    }
}

export const query6=async (req,res)=>{
    try {
        const connection=await mysql.createConnection(config.get('database'));
        
        const query6=await connection.query(`
        SELECT COUNT(DISTINCT votos.id_voto) AS 'Cantidad de votos nulos'
        FROM votos 
        INNER JOIN voto_detalles ON votos.id_voto=voto_detalles.id_voto and voto_detalles.id_candidato=-1;
        `);


        await connection.end();
        res.status(200).json({
            body: { title: 'Consulta 6', data: query6[0] },
        }); 
    } catch (error) {
        res.status(500).send({"title":"Ocurrió un erro en la Consulta 6",error});
    }
}

export const query7=async (req,res)=>{
    try {
        const connection=await mysql.createConnection(config.get('database'));
        
        const query7=await connection.query(`
            
        SELECT COUNT(votos.id_voto) AS 'Cantidad de votos' , ciudadanos.edad AS 'Edad de ciudadano'
        FROM votos 
        INNER JOIN ciudadanos ON votos.dpi=ciudadanos.dpi 
        GROUP BY ciudadanos.edad
        ORDER BY COUNT(votos.id_voto) DESC LIMIT 10;

        `);


        await connection.end();
        res.status(200).json({
            body: { title: 'Consulta 7', data: query7[0] },
        }); 
    } catch (error) {
        res.status(500).send({"title":"Ocurrió un erro en la Consulta 7",error});
    }
}

export const query8=async (req,res)=>{
    try {
        const connection=await mysql.createConnection(config.get('database'));
          /* 
                  SELECT can1.nombre AS 'Presidente',can2.nombre AS 'Presidente2',COUNT(votos.id_voto) AS 'Cantidad de votos'
        FROM votos
        INNER JOIN voto_detalles v1 ON votos.id_voto=v1.id_voto and v1.id_candidato<>-1 

        INNER JOIN candidatos can1 ON v1.id_candidato=can1.id_candidato and can1.id_cargo=1
        INNER JOIN candidatos can2 ON v1.id_candidato=can2.id_candidato and can2.id_cargo=2

        GROUP BY can1.nombre,can2.nombre
        ORDER BY COUNT(votos.id_voto) DESC
        LIMIT 10;
        
        */
        const query8=await connection.query(`
        SELECT can1.nombre AS 'Presidente',can2.nombre AS 'Vicepresidente' ,COUNT(votos.id_voto) AS 'Cantidad de votos'
        FROM votos
        INNER JOIN voto_detalles v1 ON votos.id_voto=v1.id_voto and v1.id_candidato<>-1 

        INNER JOIN candidatos can1 ON v1.id_candidato=can1.id_candidato and can1.id_cargo=1
        INNER JOIN candidatos can2 ON can1.id_partido=can2.id_partido and can2.id_cargo=2 

        GROUP BY can1.nombre,can2.nombre
        ORDER BY COUNT(votos.id_voto) DESC;
       
        `);


        await connection.end();
        res.status(200).json({
            body: { title: 'Consulta 8', data: query8[0] },
        }); 
    } catch (error) {
        res.status(500).send({"title":"Ocurrió un erro en la Consulta 8",error});
    }
}


export const query9=async (req,res)=>{
    try {
        const connection=await mysql.createConnection(config.get('database'));
        const query9=await connection.query(`
        SELECT COUNT(votos.id_voto) AS 'Cantidad de votos',mesas.id_mesa AS 'Numero de mesa', departamentos.nombre AS 'Departamento'
        FROM votos INNER JOIN mesas ON votos.id_mesa=mesas.id_mesa 
        INNER JOIN departamentos ON
        departamentos.id_departamento=mesas.id_departamento
        GROUP BY  mesas.id_mesa, departamentos.nombre
        ORDER BY  COUNT(votos.id_voto) DESC LIMIT 5;

        `);


        await connection.end();
        res.status(200).json({
            body: { title: 'Consulta 9', data: query9[0] },
        }); 
    } catch (error) {
        res.status(500).send({"title":"Ocurrió un erro en la Consulta 9",error});
    }
}

export const query10=async (req,res)=>{
    try {
        const connection=await mysql.createConnection(config.get('database'));
        const query10=await connection.query(`

        SELECT TIME(votos.fecha_hora) AS 'Hora', COUNT(votos.id_voto) AS 'Cantidad de votos'
        FROM votos
        GROUP BY Hora
        ORDER BY COUNT(votos.id_voto) DESC 
        LIMIT 5;

        `);


        await connection.end();
        res.status(200).json({
            body: { title: 'Consulta 10', data: query10[0] },
        }); 
    } catch (error) {
        res.status(500).send({"title":"Ocurrió un erro en la Consulta 10",error});
    }
}

export const query11=async (req,res)=>{
    try {
        const connection=await mysql.createConnection(config.get('database'));
        const query11=await connection.query(`


            SELECT ciudadanos.genero AS 'Genero', COUNT(votos.id_voto) AS 'Cantidad de votos'
            FROM votos
            INNER JOIN ciudadanos ON votos.dpi=ciudadanos.dpi
            GROUP BY  ciudadanos.genero
            ORDER BY COUNT(votos.id_voto)
            DESC
            ;
        `);


        await connection.end();
        res.status(200).json({
            body: { title: 'Consulta 11', data: query11[0] },
        }); 
    } catch (error) {
        res.status(500).send({"title":"Ocurrió un erro en la Consulta 11",error});
    }
}