import pool from '../config/db.js';
import { ultimaCalificacion } from '../controllers/controller.js';

const Calificacion = {
  async verHistorial(evaluadoId) {
    const queryConfig = {
      text: `
        SELECT 
          cal.id as calificacion_id,
          cal.evaluador_id,
          cal.evaluado_id,
          cal.puntaje,
          cal.comentario,
          cal.fecha,
          cal.cupo_id
        FROM calificacion.calificaciones cal
        WHERE cal.evaluado_id = $1
        ORDER BY cal.fecha DESC
      `,
      values: [evaluadoId]
    };
    
    console.log(queryConfig);
    const result = await pool.query(queryConfig);
    return result.rows;


   


  },

async ultimaCalificacion(evaluadoId) {
  const queryConfig = {

  text: `SELECT *
            FROM calificacion.calificaciones
            WHERE evaluado_id = $1::numeric
            ORDER BY fecha DESC
            LIMIT 1;
`,
  values: [evaluadoId]
};

console.log(queryConfig);

const result = await pool.query(queryConfig);

    return result.rows;
},

async crearCalificacion(datos) {
    const client = await pool.connect();
    try {
      const { evaluador_id, 
              evaluado_id, 
              cupo_id, 
              puntaje, 
              comentario} = datos;

      // Crear calificación
      const insertQuery = `
        INSERT INTO calificacion.calificaciones (evaluador_id, evaluado_id, cupo_id, puntaje, comentario)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      console.log(insertQuery);
      const result = await client.query(insertQuery, [evaluador_id, evaluado_id, cupo_id, puntaje, comentario]);
      return result.rows[0];

    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  },


};

export default Calificacion;


