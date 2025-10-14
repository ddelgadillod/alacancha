import Spot from '../models/model.js';


export async function findSpot(req, res) {
  const sport = req.body.sport || null;
    const value = req.body.value || null;
    const date  = req.body.date  || null;
    console.log(sport);
    console.log(value);
    console.log(date);
  try {

    const spots = await Spot.find(sport, value, date);
    res.status(201).json(spots);
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Error finding spots' });
  }
};

export async function getHistorialParticipacion(req, res) {

  const usuarioId = req.query.usuarioId || null;
  //const usuarioId = 3;



  console.log(usuarioId);

  try {

    const historial = await  Spot.getHistorialByUser(parseInt(usuarioId));
    res.status(201).json(historial);
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Error finding user participation history' });
  }
}

export async function crearCupo(req, res) {
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
      roles,
      cantidad
    } = req.body;
    
    // ==========================================
    // 1. VALIDAR CAMPOS OBLIGATORIOS
    // ==========================================
    
    if (!creador_id) {
      return res.status(400).json({
        error: 'El ID del creador es obligatorio'
      });
    }
    
    if (!deporte || deporte.trim() === '') {
      return res.status(400).json({
        error: 'El deporte es obligatorio'
      });
    }
    
    if (valor === undefined || valor === null) {
      return res.status(400).json({
        error: 'El valor es obligatorio'
      });
    }
    
    if (cantidad === undefined || cantidad === null) {
      return res.status(400).json({
        error: 'La cantidad es obligatoria'
      });
    }

    if (!duracion) {
      return res.status(400).json({
        error: 'La duración es obligatoria'
      });
    }
    
    if (!lugar || lugar.trim() === '') {
      return res.status(400).json({
        error: 'El lugar es obligatorio'
      });
    }
    
    if (!fecha) {
      return res.status(400).json({
        error: 'La fecha es obligatoria'
      });
    }
    
    if (!hora) {
      return res.status(400).json({
        error: 'La hora es obligatoria'
      });
    }
    
    if (!roles) {
      return res.status(400).json({
        error: 'Los roles son obligatorios'
      });
    }
    
    // ==========================================
    // 2. VALIDAR TIPOS Y FORMATOS
    // ==========================================
    
    // Validar y normalizar deporte
    const deporteNormalizado = normalizarDeporte(deporte);
    if (!deporteNormalizado) {
      return res.status(400).json({
        error: 'Deporte inválido'
      });
    }
    
    // Validar valor
    const valorNum = parseFloat(valor);
    if (isNaN(valorNum) || valorNum < 0) {
      return res.status(400).json({
        error: 'El valor debe ser un número positivo o cero'
      });
    }
    
    // Validar duración
    const duracionNum = parseInt(duracion);
    if (isNaN(duracionNum) || duracionNum <= 0) {
      return res.status(400).json({
        error: 'La duración debe ser un número positivo (minutos)'
      });
    }
    
    if (duracionNum > 480) { // Máximo 8 horas
      return res.status(400).json({
        error: 'La duración máxima es 480 minutos (8 horas)'
      });
    }
    
    // Validar cantidad
    const cantidadNum = parseInt(cantidad);
    if (isNaN(cantidadNum) || cantidadNum <= 0) {
      return res.status(400).json({
        error: 'La cantidad debe ser un número entero positivo'
      });
    }
    if (cantidadNum > 10) { // Máximo 10 cupos
      return res.status(400).json({
        error: 'La cantidad máxima es 10 cupos'
      });
    }

    // Validar fecha y hora
    const validacionFechaHora = validarFechaHora(fecha, hora);
    if (!validacionFechaHora.valido) {
      return res.status(400).json({
        error: validacionFechaHora.error
      });
    }
    
    // Validar que sea en el futuro
    const fechaHoraCupo = new Date(`${fecha}T${hora}`);
    const ahora = new Date();
    
    if (fechaHoraCupo <= ahora) {
      return res.status(400).json({
        error: 'La fecha y hora del cupo debe ser en el futuro'
      });
    }
    
    // Validar coordenadas
    if ((lat && !lon) || (!lat && lon)) {
      return res.status(400).json({
        error: 'Latitud y longitud deben proporcionarse juntas'
      });
    }
    
    let latNum = null;
    let lonNum = null;
    
    if (lat && lon) {
      latNum = parseFloat(lat);
      lonNum = parseFloat(lon);
      
      if (isNaN(latNum) || latNum < -90 || latNum > 90) {
        return res.status(400).json({
          error: 'Latitud inválida. Debe estar entre -90 y 90'
        });
      }
      
      if (isNaN(lonNum) || lonNum < -180 || lonNum > 180) {
        return res.status(400).json({
          error: 'Longitud inválida. Debe estar entre -180 y 180'
        });
      }
    }
    
    // ==========================================
    // 3. VALIDAR ROLES
    // ==========================================
    
    let rolesObj;
    
    try {
      // Si viene como string, parsearlo
      rolesObj = typeof roles === 'string' ? JSON.parse(roles) : roles;
    } catch (error) {
      return res.status(400).json({
        error: 'Formato de roles inválido. Debe ser un objeto JSON'
      });
    }
    
    if (typeof rolesObj !== 'object' || Array.isArray(rolesObj) || rolesObj === null) {
      return res.status(400).json({
        error: 'Los roles deben ser un objeto con formato: {"rol1": cantidad, "rol2": cantidad}'
      });
    }
    
    const rolesKeys = Object.keys(rolesObj);
    
    if (rolesKeys.length === 0) {
      return res.status(400).json({
        error: 'Debe definir al menos un rol'
      });
    }
    
    // Validar cada rol
    for (const rol of rolesKeys) {
      const cantidad = rolesObj[rol];
      
      if (typeof cantidad !== 'number' || cantidad < 1 || !Number.isInteger(cantidad)) {
        return res.status(400).json({
          error: `La cantidad para el rol "${rol}" debe ser un número entero positivo`
        });
      }
      
      if (cantidad > 20) {
        return res.status(400).json({
          error: `La cantidad máxima por rol es 20 (rol: "${rol}")`
        });
      }
    }
    
    const totalCupos = Object.values(rolesObj).reduce((a, b) => a + b, 0);
    
    if (totalCupos > 50) {
      return res.status(400).json({
        error: 'El total de cupos no puede exceder 50'
      });
    }
    
    // ==========================================
    // 4. CREAR CUPO
    // ==========================================
    
    // Formatear duración para PostgreSQL INTERVAL
    const duracionInterval = `${duracionNum} minutes`;
    
    const cupo = await Spot.crearCupo({
      creador_id,
      deporte: deporteNormalizado,
      valor: valorNum,
      duracion: duracionInterval,
      lugar: lugar.trim(),
      fecha,
      hora,
      lat: latNum,
      lon: lonNum,
      roles: rolesObj,
      cantidad: cantidadNum
    });
    
    // ==========================================
    // 5. RESPONDER
    // ==========================================
    
    res.status(201).json({
      success: true,
      mensaje: 'Cupo creado exitosamente',
      cupo
    });
    
  } catch (error) {
    console.error('Error al crear cupo:', error);
    
    res.status(500).json({
      error: 'Error interno del servidor',
      detalle: error.message
    });
  }
}

export async function obtenerCupo(req, res) {
    try {
      const id = req.query.id || null;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          error: 'ID de cupo inválido'
        });
      }

      const cupo = await Spot.obtenerCupoPorId(parseInt(id));
      console.log(cupo);
      if (!cupo) {
        return res.status(404).json({
          error: 'Cupo no encontrado'
        });
      }

      // Obtener participaciones
      const participaciones = await Spot.obtenerParticipacionesCupo(parseInt(id));

      res.json({
        success: true,
        cupo: {
          ...cupo,
          participantes: participaciones,
          total_participantes: participaciones.length
        }
      });

    } catch (error) {
      console.error('Error al obtener cupo:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        detalle: error.message
      });
    }
  }

function normalizarDeporte(deporte) {
  if (!deporte) return null;
  
  return deporte
    .toLowerCase()
    .normalize('NFD') 
    .replace(/[\u0300-\u036f]/g, '') 
    .trim();
}

// Función auxiliar para validar fecha y hora
function validarFechaHora(fecha, hora = null) {
  const regexFecha = /^\d{4}-\d{2}-\d{2}$/;
  const regexHora = /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
  
  if (!regexFecha.test(fecha)) {
    return { valido: false, error: 'Formato de fecha inválido. Use YYYY-MM-DD' };
  }
  
  const date = new Date(fecha);
  if (isNaN(date.getTime())) {
    return { valido: false, error: 'Fecha inválida' };
  }
  
  if (hora && !regexHora.test(hora)) {
    return { valido: false, error: 'Formato de hora inválido. Use HH:MM o HH:MM:SS' };
  }
  
  return { valido: true };
}

export async function buscarCupos(req, res) {
  try {
    // ==========================================
    // 1. EXTRAER PARÁMETROS
    // ==========================================
    
    const deporte = req.query.deporte;
    const precio = req.query.precio;
    const fecha = req.query.fecha;
    const hora = req.query.hora;
    const lat = req.query.lat;
    const lon = req.query.lon;
    const radio = req.query.radio;
    const limite = req.query.limite || 10;
    const userId = req.query.userId;
    
    // ==========================================
    // 2. VALIDACIÓN: AL MENOS UN CRITERIO OBLIGATORIO
    // ==========================================
    
    if (!deporte && !precio && !fecha) {
      return res.status(400).json({
        error: 'Debes proporcionar al menos uno de estos criterios: deporte, precio o fecha'
      });
    }
    
    // ==========================================
    // 3. VALIDACIÓN Y NORMALIZACIÓN: DEPORTE (OPCIONAL pero exacto)
    // ==========================================
    
    let deporteNormalizado = null;
    
    if (deporte) {
      if (deporte.trim() === '') {
        return res.status(400).json({
          error: 'El deporte no puede estar vacío'
        });
      }
      
      deporteNormalizado = normalizarDeporte(deporte);
      
      if (!deporteNormalizado) {
        return res.status(400).json({
          error: 'Deporte inválido después de normalización'
        });
      }
    }
    
    // ==========================================
    // 4. VALIDACIÓN: LÍMITE DE RESULTADOS
    // ==========================================
    
    const limiteNum = parseInt(limite);
    
    if (isNaN(limiteNum) || limiteNum < 1) {
      return res.status(400).json({
        error: 'El límite debe ser un número positivo'
      });
    }
    
    if (limiteNum > 10) {
      return res.status(400).json({
        error: 'El límite máximo es 10 resultados'
      });
    }
    
    // ==========================================
    // 5. VALIDACIÓN: PRECIO (OPCIONAL)
    // ==========================================
    
    let precioMaximo = null;
    
    if (precio) {
      precioMaximo = parseFloat(precio);
      
      if (isNaN(precioMaximo) || precioMaximo < 0) {
        return res.status(400).json({
          error: 'El precio debe ser un número positivo'
        });
      }
    }
    
    // ==========================================
    // 6. VALIDACIÓN: FECHA EXACTA (OPCIONAL)
    // ==========================================
    
    let fechaExacta = null;
    
    if (fecha) {
      const validacionFecha = validarFechaHora(fecha);
      
      if (!validacionFecha.valido) {
        return res.status(400).json({
          error: validacionFecha.error
        });
      }
      
      fechaExacta = fecha;
    }
    
    // ==========================================
    // 7. VALIDACIÓN: HORA EXACTA (OPCIONAL)
    // ==========================================
    
    let horaExacta = null;
    
    if (hora) {
      const validacionHora = validarFechaHora('2024-01-01', hora);
      
      if (!validacionHora.valido) {
        return res.status(400).json({
          error: validacionHora.error
        });
      }
      
      horaExacta = hora.length === 5 ? `${hora}:00` : hora;
    }
    
    // ==========================================
    // 8. VALIDACIÓN: UBICACIÓN (OPCIONAL)
    // ==========================================
    
    let ubicacion = null;
    
    if (lat || lon || radio) {
      if (!lat || !lon || !radio) {
        return res.status(400).json({
          error: 'Para búsqueda por ubicación se requieren: lat, lon y radio'
        });
      }
      
      const latNum = parseFloat(lat);
      const lonNum = parseFloat(lon);
      const radioNum = parseFloat(radio);
      
      if (isNaN(latNum) || latNum < -90 || latNum > 90) {
        return res.status(400).json({
          error: 'Latitud inválida. Debe estar entre -90 y 90'
        });
      }
      
      if (isNaN(lonNum) || lonNum < -180 || lonNum > 180) {
        return res.status(400).json({
          error: 'Longitud inválida. Debe estar entre -180 y 180'
        });
      }
      
      if (isNaN(radioNum) || radioNum <= 0 || radioNum > 100) {
        return res.status(400).json({
          error: 'Radio inválido. Debe ser entre 1 y 100 kilómetros'
        });
      }
      
      ubicacion = {
        lat: latNum,
        lon: lonNum,
        radio_km: radioNum
      };
    }
    
    // ==========================================
    // 9. CONSTRUIR OBJETO DE FILTROS VALIDADOS
    // ==========================================
    
    const filtros = {
      deporte: deporteNormalizado,
      precio: precioMaximo,
      fecha: fechaExacta,
      hora: horaExacta,
      ubicacion: ubicacion,
      userId: userId
    };
    
    // ==========================================
    // 10. LLAMAR AL MODELO CON DATOS VALIDADOS
    // ==========================================
    
    const cupos = await Spot.buscarCupos(filtros, limiteNum);
    
    // ==========================================
    // 11. RESPONDER CON RESULTADOS (ahora incluye creador_nombre)
    // ==========================================
    
    res.json({
      success: true,
      total: cupos.length,
      limite: limiteNum,
      filtros_aplicados: {
        deporte: deporteNormalizado,
        precio_maximo: precioMaximo,
        fecha: fechaExacta,
        hora: horaExacta,
        ubicacion: ubicacion ? `${ubicacion.lat}, ${ubicacion.lon} (${ubicacion.radio_km}km)` : null
      },
      cupos
    });
    
  } catch (error) {
    console.error('Error al buscar cupos:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      detalle: error.message
    });
  }
}

export async function participarEnCupo(req, res) {
    try {
      const { cupoId,
              usuarioId
       } = req.body;

      const rol = 'jugador';

      if (!cupoId || isNaN(cupoId)) {
        return res.status(400).json({
          error: 'ID de cupo inválido'
        });
      }

      
      
      const participacion = await Spot.participarEnCupo(
        parseInt(cupoId), 
        usuarioId, 
        rol
      );
      console.log(participacion);
      
      if (participacion.rows.length === 0) {
        throw new Error('Cupo no encontrado');
      }

      const cupo = participacion.rows[0];
//revisar estado
      if (cupo.estado !== 'pendiente') {
        throw new Error('No se puede participar en este cupo');
      }

      if (cupo.creador_id === usuarioId) {
        throw new Error('No puedes participar en tu propio cupo');
      }

      const actualiza = Spot.actualizarEstadoCupo(parseInt(cupoId));

      const crear = Spot.crearParticipacion(cupoId, usuarioId, rol);

      res.status(201).json({
        success: true,
        mensaje: 'Te has unido al cupo exitosamente',
        estado: "OK"
      });

    } catch (error) {
      console.error('Error al participar en cupo:', error);
      
      if (error.message.includes('no encontrado') ||
          error.message.includes('No se puede participar') ||
          error.message.includes('No puedes participar') ||
          error.message.includes('Ya estás participando') ||
          error.message.includes('No hay cupos disponibles')) {
        return res.status(400).json({
          error: error.message
        });
      }

      res.status(500).json({
        error: 'Error interno del servidor',
        detalle: error.message
      });
    }
  }