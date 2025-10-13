import pool from '../config/db.js';

const Notificacion = {
  // Guardar suscripción push de un usuario
  async guardarSuscripcion(usuarioId, suscripcion) {
    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO notificaciones.suscripciones (usuario_id, endpoint, keys)
        VALUES ($1, $2, $3)
        ON CONFLICT (usuario_id, endpoint) 
        DO UPDATE SET keys = $3, actualizado_en = NOW()
        RETURNING *
      `;
      
      const result = await client.query(query, [
        usuarioId,
        suscripcion.endpoint,
        JSON.stringify(suscripcion.keys)
      ]);
      
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  // Obtener suscripciones de usuarios que coinciden con el cupo
  async obtenerSuscripcionesParaCupo(cupoData) {
    try {
      const { deporte, lat, lon, hora, fecha } = cupoData;
      
      // Normalizar deporte
      const deporteNormalizado = deporte.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      
      // Extraer la hora del cupo
      const horaCupo = new Date(`2000-01-01T${hora}`).getHours();
      
      let query = `
        SELECT DISTINCT 
          u.id as usuario_id,
          u.nombre,
          u.correo,
          s.endpoint,
          s.keys
        FROM auth.usuarios u
        INNER JOIN notificaciones.suscripciones s ON u.id = s.usuario_id
        WHERE s.activa = true
      `;
      
      const valores = [];
      let paramIndex = 1;
      
      // Filtro por deporte
      if (deporte) {
        query += ` AND $${paramIndex}::text = ANY(u.deportes_preferidos)`;
        valores.push(deporteNormalizado);
        paramIndex++;
      }
      
      // Filtro por ubicación (20km de radio)
      if (lat && lon) {
        query += `
          AND u.lat IS NOT NULL 
          AND u.lon IS NOT NULL
          AND (
            6371 * acos(
              cos(radians($${paramIndex})) * 
              cos(radians(u.lat)) * 
              cos(radians(u.lon) - radians($${paramIndex + 1})) + 
              sin(radians($${paramIndex})) * 
              sin(radians(u.lat))
            )
          ) <= 20
        `;
        valores.push(lat, lon);
        paramIndex += 2;
      }
      
      // Filtro por horario disponible
      if (hora) {
        const horarioMap = {
          mañanas: [6, 12],
          tardes: [12, 18],
          noches: [18, 24],
          'fines de semana': null // No filtrar por hora
        };
        
        // Determinar horario del cupo
        let horarioCupo = 'noches';
        if (horaCupo >= 6 && horaCupo < 12) horarioCupo = 'mañanas';
        else if (horaCupo >= 12 && horaCupo < 18) horarioCupo = 'tardes';
        
        query += ` AND (
          u.horario_disponible = '{}' OR
          $${paramIndex}::text = ANY(u.horario_disponible) OR
          'fines de semana' = ANY(u.horario_disponible)
        )`;
        valores.push(horarioCupo);
        paramIndex++;
      }
      
      console.log('Query notificaciones:', query);
      console.log('Valores:', valores);
      
      const result = await pool.query(query, valores);
      return result.rows;
      
    } catch (error) {
      console.error('Error al obtener suscripciones:', error);
      throw error;
    }
  },

  // Registrar notificación enviada
  async registrarNotificacion(usuarioId, cupoId, mensaje) {
    try {
      const query = `
        INSERT INTO notificaciones.historial (usuario_id, cupo_id, mensaje)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      
      const result = await pool.query(query, [usuarioId, cupoId, mensaje]);
      return result.rows[0];
    } catch (error) {
      console.error('Error al registrar notificación:', error);
      throw error;
    }
  },

  // Desactivar suscripción
  async desactivarSuscripcion(endpoint) {
    try {
      const query = `
        UPDATE notificaciones.suscripciones
        SET activa = false
        WHERE endpoint = $1
        RETURNING *
      `;
      
      const result = await pool.query(query, [endpoint]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
};

export default Notificacion;