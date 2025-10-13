import pool from '../config/db.js';


const Spot = {
  async find(sport, value, date) {
  const queryConfig = {
  text: `
    SELECT *
      FROM spot.cupos
      WHERE ($1::text IS NULL OR deporte = $1::text)
          AND ($2::numeric IS NULL OR valor <= $2::numeric)
          AND ($3::date IS NULL OR fecha = $3::date)`,
  values: [sport, value, date]
};

console.log(queryConfig);

const result = await pool.query(queryConfig);

    return result.rows;
  },

  async getHistorialByUser(usuarioId) {
    const queryConfig = {
    text: `
      SELECT 
        p.id as participacion_id,
        p.rol,
        c.id as cupo_id,
        c.deporte,
        c.lugar,
        c.fecha,
        c.hora,
        c.duracion,
        c.valor,
        c.estado as cupo_estado,
        c.creador_id,
        c.lat,
        c.lon,
        c.roles as cupo_roles,
        c.creado_en as cupo_creado_en
      FROM spot.participaciones p
      INNER JOIN spot.cupos c ON p.cupo_id = c.id
      WHERE p.usuario_id = $1::integer OR c.creador_id = $1::integer
      ORDER BY c.fecha DESC, c.hora DESC
    `,      
      values: [usuarioId]
    };

    const result = await pool.query(queryConfig);
    const historial = result.rows;

    // Obtener calificaciones para todos los cupos encontrados
    const cupoIds = historial.map(h => h.cupo_id);
    if (cupoIds.length === 0) return [];

    const calificacionesQuery = {
      text: `
        SELECT 
          id,
          evaluador_id,
          evaluado_id,
          puntaje,
          comentario,
          fecha,
          cupo_id
        FROM calificacion.calificaciones
        WHERE cupo_id = ANY($1::int[])
        ORDER BY fecha DESC
      `,
      values: [cupoIds],
    };

    const calificacionesResult = await pool.query(calificacionesQuery);
    const calificaciones = calificacionesResult.rows;


     // Agrupar calificaciones por cupo_id
    const calificacionesPorCupo = {};
    for (const cal of calificaciones) {
      if (!calificacionesPorCupo[cal.cupo_id]) {
        calificacionesPorCupo[cal.cupo_id] = [];
      }
      calificacionesPorCupo[cal.cupo_id].push(cal);
    }

    // Combinar historial con calificaciones
    const historialConCalificaciones = historial.map(item => ({
      ...item,
      calificaciones: calificacionesPorCupo[item.cupo_id] || [],
    }));

    return historialConCalificaciones;

  },

  async crearCupo(datos) {
  const client = await pool.connect();
  try {
    const {
      creador_id,
      deporte,
      valor,
      duracion,
      lugar,
      fecha,
      hora,
      lat,
      lon,
      roles
    } = datos;
    
    const insertQuery = `
      INSERT INTO spot.cupos (
        creador_id, deporte, valor, duracion, lugar, 
        fecha, hora, lat, lon, roles, estado
      )
      VALUES ($1, $2, $3, $4::interval, $5, $6, $7, $8, $9, $10, 'pendiente')
      RETURNING *
    `;
    
    const result = await client.query(insertQuery, [
      creador_id,
      deporte,
      valor,
      duracion, // Ya viene como "60 minutes"
      lugar,
      fecha,
      hora,
      lat,
      lon,
      JSON.stringify(roles)
    ]);
    
    return result.rows[0];
    
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
},

async obtenerParticipacionesCupo(cupoId) {
    try {
      const query = `
        SELECT id, usuario_id, rol
        FROM spot.participaciones 
        WHERE cupo_id = $1
        ORDER BY id
      `;
      
      const result = await pool.query(query, [cupoId]);
      return result.rows;

    } catch (error) {
      throw error;
    }
  },

async buscarCupos(filtros, limite) {
  try {
    const {
      deporte,
      precio,
      fecha,
      hora,
      ubicacion
    } = filtros;
    
    console.log('Buscar cupos con filtros validados:', filtros);
    
    // Obtener fecha y hora actual
    const ahora = new Date();
    const fechaHoy = ahora.toISOString().split('T')[0]; // YYYY-MM-DD
    const horaActual = ahora.toTimeString().split(' ')[0]; // HH:MM:SS
    
    // Query base: solo cupos pendientes Y futuros CON JOIN a usuarios
    let query = `
      SELECT 
        c.id, 
        c.creador_id, 
        c.deporte, 
        c.valor, 
        c.duracion, 
        c.lugar, 
        c.fecha, 
        c.hora, 
        c.lat, 
        c.lon, 
        c.roles, 
        c.creado_en, 
        c.estado,
        u.nombre AS creador_nombre
      FROM spot.cupos c
      INNER JOIN auth.usuarios u ON c.creador_id = u.id
      WHERE c.estado = 'pendiente'
        AND (c.fecha > $1::date OR (c.fecha = $1::date AND c.hora > $2::time))
    `;
    
    const valores = [fechaHoy, horaActual];
    let paramIndex = 3;
    
    // Filtro EXACTO por deporte (si se proporciona)
    if (deporte) {
      query += ` AND c.deporte = $${paramIndex++}`;
      valores.push(deporte);
    }
    
    // Filtro menor o igual por precio (si se proporciona)
    if (precio !== null && precio !== undefined) {
      query += ` AND c.valor <= $${paramIndex++}`;
      valores.push(precio);
    }
    
    // Filtro EXACTO por fecha (si se proporciona)
    if (fecha) {
      query += ` AND c.fecha = $${paramIndex++}::date`;
      valores.push(fecha);
    }
    
    // Filtro EXACTO por hora (si se proporciona)
    if (hora) {
      query += ` AND c.hora = $${paramIndex++}::time`;
      valores.push(hora);
    }
    
    // Filtro OPCIONAL por ubicación (radio)
    if (ubicacion) {
      query += ` 
        AND c.lat IS NOT NULL 
        AND c.lon IS NOT NULL
        AND (
          6371 * acos(
            cos(radians($${paramIndex})) * 
            cos(radians(c.lat)) * 
            cos(radians(c.lon) - radians($${paramIndex + 1})) + 
            sin(radians($${paramIndex})) * 
            sin(radians(c.lat))
          )
        ) <= $${paramIndex + 2}
      `;
      valores.push(ubicacion.lat, ubicacion.lon, ubicacion.radio_km);
      paramIndex += 3;
    }
    
    // Ordenar por fecha y hora más próximas
    query += ` ORDER BY c.fecha ASC, c.hora ASC`;
    
    // Aplicar límite
    query += ` LIMIT $${paramIndex}`;
    valores.push(limite);
    
    console.log('Query ejecutada:', query);
    console.log('Valores:', valores);
    
    const result = await pool.query(query, valores);
    return result.rows;
    
  } catch (error) {
    console.error('Error en buscarCupos model:', error);
    throw error;
  }
},
  async participarEnCupo(cupoId, usuarioId, rol = 'jugador') {
    const client = await pool.connect();
    try {
      // Verificar que el cupo existe y está activo/pendiente
      const cupoQuery = 'SELECT creador_id, estado, roles FROM spot.cupos WHERE id = $1';
      const cupoResult = await client.query(cupoQuery, [cupoId]);


      return cupoResult;

    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  },


  async actualizarEstadoCupo(cupoId) { 
    const client = await pool.connect();
    try {
      const updateQuery = `
        UPDATE spot.cupos SET estado = 'activo' WHERE id = $1 
        RETURNING *
      `;


      const result = await client.query(updateQuery, [cupoId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  },

  async crearParticipacion(cupoId, usuarioId, rol) { 
    const client = await pool.connect();
    try {
      const updateQuery = `
      INSERT INTO spot.participaciones (cupo_id, usuario_id, rol)
        VALUES ($1, $2, $3)
        RETURNING *
      `;


      const result = await client.query(updateQuery, [cupoId,usuarioId, rol]);
      return result.rows[0];
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  },



};



export default Spot;
