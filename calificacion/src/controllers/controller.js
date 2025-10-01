import Calificacion from '../models/model.js';


export async function ultimaCalificacion(req, res) {
    const evaluadoId = req.query.evaluadoId || null;
    console.log("Evaluado:" + evaluadoId);
  try {

    const calificacion = await Calificacion.ultimaCalificacion(evaluadoId);
    res.status(201).json(calificacion);
  } catch (err) {
    console.log("ERROR:: " + err)
    res.status(500).json({ error: 'Error finding scores for user' });
  }
}


export async function verHistorial(req, res) {
    const evaluadoId = req.query.evaluadoId || null;
    console.log("Evaluado:" + evaluadoId);
  try {

    const calificacion = await Calificacion.verHistorial(evaluadoId);
    res.status(201).json(calificacion);
  } catch (err) {
    console.log("ERROR:: " + err)
    res.status(500).json({ error: 'Error finding scores for user' });
  }
}

export async function crearCalificacion(req, res) {
    try {
      const { evaluador_id, 
              evaluado_id, 
              cupo_id, 
              puntaje, 
              comentario } = req.body;

      // Validaciones
      if (!evaluador_id || !evaluado_id || !cupo_id || !puntaje) {
        return res.status(400).json({
          error: 'evaluador_id, evaluado_id, cupo_id y puntaje son requeridos'
        });
      }

      if (puntaje < 1 || puntaje > 5) {
        return res.status(400).json({
          error: 'El puntaje debe estar entre 1 y 5'
        });
      }

      if (comentario && comentario.length > 200) {
        return res.status(400).json({
          error: 'El comentario no puede exceder 500 caracteres'
        });
      }
      const calificacion = await Calificacion.crearCalificacion({
        evaluador_id,
        evaluado_id: parseInt(evaluado_id),
        cupo_id: parseInt(cupo_id),
        puntaje: parseInt(puntaje),
        comentario: comentario?.trim()
      });

      res.status(201).json({
        success: true,
        mensaje: 'Calificación creada exitosamente',
        calificacion
      });

    } catch (error) {
      console.error('Error al crear calificación:', error);
      

      res.status(500).json({
        error: 'Error interno del servidor',
        detalle: error.message
      });
    }
  }