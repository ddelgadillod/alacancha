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
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pendiente')
        RETURNING *
      `;

      const result = await client.query(insertQuery, [
        creador_id,
        deporte,
        valor,
        duracion,
        lugar,
        fecha,
        hora,
        lat,
        lon,
        roles ? JSON.stringify(roles) : null
      ]);

      return result.rows[0];

    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  },

    async obtenerCupoPorId(id) {
    try {
      const query = `
        SELECT id, creador_id, deporte, valor, duracion, lugar, 
               fecha, hora, lat, lon, roles, creado_en, estado
        FROM spot.cupos 
        WHERE id = $1
      `;
      
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;

    } catch (error) {
      throw error;
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
    
    // Query base: solo cupos pendientes
    let query = `
      SELECT 
        id, creador_id, deporte, valor, duracion, lugar, 
        fecha, hora, lat, lon, roles, creado_en, estado
      FROM spot.cupos 
      WHERE estado = 'pendiente'
    `;
    
    const valores = [];
    let paramIndex = 1;
    
    // Filtro OBLIGATORIO por deporte
    query += ` AND deporte = $${paramIndex++}`;
    valores.push(deporte);
    
    // Filtro OPCIONAL por precio máximo
    if (precio !== null && precio !== undefined) {
      query += ` AND valor <= $${paramIndex++}`;
      valores.push(precio);
    }
    
    // Filtros por fecha y/o hora (INDEPENDIENTES)
    if (fecha && hora) {
      // CASO 1: Fecha Y hora especificadas
      // Mostrar cupos hasta esa fecha, y en cada día solo hasta esa hora
      query += ` AND (fecha < $${paramIndex}::date OR (fecha = $${paramIndex + 1}::date AND hora <= $${paramIndex + 2}::time))`;
      valores.push(fecha, fecha, hora);
      paramIndex += 3;
      
    } else if (fecha) {
      // CASO 2: Solo fecha especificada (sin importar si hora existe o no)
      // Mostrar cupos hasta esa fecha, cualquier hora
      query += ` AND fecha <= $${paramIndex++}::date`;
      valores.push(fecha);
      
    } else if (hora) {
      // CASO 3: Solo hora especificada (sin importar si fecha existe o no)
      // Mostrar cupos hasta esa hora, cualquier fecha
      query += ` AND hora <= $${paramIndex++}::time`;
      valores.push(hora);
    }
    // CASO 4: Ni fecha ni hora - muestra todos (sin filtro adicional)
    
    // Filtro OPCIONAL por ubicación (radio)
    if (ubicacion) {
      query += ` 
        AND lat IS NOT NULL 
        AND lon IS NOT NULL
        AND (
          6371 * acos(
            cos(radians($${paramIndex})) * 
            cos(radians(lat)) * 
            cos(radians(lon) - radians($${paramIndex + 1})) + 
            sin(radians($${paramIndex})) * 
            sin(radians(lat))
          )
        ) <= $${paramIndex + 2}
      `;
      valores.push(ubicacion.lat, ubicacion.lon, ubicacion.radio_km);
      paramIndex += 3;
    }
    
    // Ordenar del más reciente al más distante (CORREGIDO)
    // Primero los más próximos en el tiempo
    query += ` ORDER BY fecha ASC, hora ASC`;
    
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
