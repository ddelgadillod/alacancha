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

  //const usuarioId = req.query.usuarioId || null;
  const usuarioId = 3;



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
    //const creador_id = req.usuario.id;
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
    } = req.body;

    // Validaciones
    if (!deporte || !lugar || !fecha || !hora) {
      return res.status(400).json({
        error: 'Faltan campos obligatorios: deporte, lugar, fecha, hora'
      });
    }

    // Validar fecha no sea en el pasado
    const fechaCupo = new Date(`${fecha}T${hora}`);
    const ahora = new Date();
    
    if (fechaCupo <= ahora) {
      return res.status(400).json({
        error: 'La fecha y hora del cupo debe ser en el futuro'
      });
    }

    // Validar coordenadas si se envían
    if ((lat && !lon) || (!lat && lon)) {
      return res.status(400).json({
        error: 'lat y lon deben proporcionarse juntos'
      });
    }

    const cupo = await Spot.crearCupo({
      creador_id,
      deporte: deporte.trim(),
      valor: valor ? parseFloat(valor) : null,
      duracion : duracion ? parseInt(duracion) + "minutes" : null,
      lugar: lugar.trim(),
      fecha,
      hora,
      lat: lat ? parseFloat(lat) : null,
      lon: lon ? parseFloat(lon) : null,
      roles
    });

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
    const fecha = req.query.fecha;  // Sin condicionar por hora
    const hora = req.query.hora;    // Sin condicionar por fecha
    const lat = req.query.lat;
    const lon = req.query.lon;
    const radio = req.query.radio;
    const limite = req.query.limite || 10;
    
    // ==========================================
    // 2. VALIDACIÓN: DEPORTE OBLIGATORIO
    // ==========================================
    
    if (!deporte || deporte.trim() === '') {
      return res.status(400).json({
        error: 'El parámetro "deporte" es obligatorio'
      });
    }
    
    // Normalizar deporte (minúsculas, sin acentos)
    const deporteNormalizado = normalizarDeporte(deporte);
    
    if (!deporteNormalizado) {
      return res.status(400).json({
        error: 'Deporte inválido después de normalización'
      });
    }
    
    // ==========================================
    // 3. VALIDACIÓN: LÍMITE DE RESULTADOS
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
    // 4. VALIDACIÓN: PRECIO MÁXIMO (OPCIONAL)
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
    // 5. VALIDACIÓN: FECHA (OPCIONAL - INDEPENDIENTE)
    // ==========================================
    
    let fechaValida = null;
    
    if (fecha) {
      const validacionFecha = validarFechaHora(fecha);
      
      if (!validacionFecha.valido) {
        return res.status(400).json({
          error: validacionFecha.error
        });
      }
      
      fechaValida = fecha;
    }
    
    // ==========================================
    // 6. VALIDACIÓN: HORA (OPCIONAL - INDEPENDIENTE)
    // ==========================================
    
    let horaValida = null;
    
    if (hora) {
      const validacionHora = validarFechaHora('2024-01-01', hora); // Fecha dummy para validar solo hora
      
      if (!validacionHora.valido) {
        return res.status(400).json({
          error: validacionHora.error
        });
      }
      
      // Normalizar formato de hora (agregar :00 si falta)
      horaValida = hora.length === 5 ? `${hora}:00` : hora;
    }
    
    // ==========================================
    // 7. VALIDACIÓN: UBICACIÓN (OPCIONAL)
    // ==========================================
    
    let ubicacion = null;
    
    if (lat || lon || radio) {
      // Si se proporciona algún parámetro de ubicación, todos son requeridos
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
    // 8. CONSTRUIR OBJETO DE FILTROS VALIDADOS
    // ==========================================
    
    const filtros = {
      deporte: deporteNormalizado,
      precio: precioMaximo,
      fecha: fechaValida,        // Independiente de hora
      hora: horaValida,          // Independiente de fecha
      ubicacion: ubicacion
    };
    
    // ==========================================
    // 9. LLAMAR AL MODELO CON DATOS VALIDADOS
    // ==========================================
    
    const cupos = await Spot.buscarCupos(filtros, limiteNum);
    
    // ==========================================
    // 10. RESPONDER CON RESULTADOS
    // ==========================================
    
    res.json({
      success: true,
      total: cupos.length,
      limite: limiteNum,
      filtros_aplicados: {
        deporte: deporteNormalizado,
        precio_maximo: precioMaximo,
        fecha_hasta: fechaValida,
        hora_hasta: horaValida,
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