import Notificacion from '../models/model.js';
import webpush from 'web-push';

// Configurar Web Push (debes generar tus propias claves VAPID)
// Ejecuta: npx web-push generate-vapid-keys
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY || 'BDV8IYMU-0w5MLn8XjrHe13P2zEHjtT7AgZA6R3BdFPHLOU68RFEz360KDfoTK5ME2NJwps63N2240cL8v2diGI',
  privateKey: process.env.VAPID_PRIVATE_KEY || 'YCxGHxW71h4SGX-XGdOjHQoT03zFznlz9VchBh-wG-s'
};

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:contacto@alacancha.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Guardar suscripción de usuario
export async function suscribir(req, res) {
  try {
    const { usuarioId, suscripcion } = req.body;

    if (!usuarioId || !suscripcion) {
      return res.status(400).json({
        error: 'usuarioId y suscripción son requeridos'
      });
    }

    const resultado = await Notificacion.guardarSuscripcion(usuarioId, suscripcion);

    res.status(201).json({
      success: true,
      mensaje: 'Suscripción guardada exitosamente',
      suscripcion: resultado
    });

  } catch (error) {
    console.error('Error al suscribir:', error);
    res.status(500).json({
      error: 'Error al guardar suscripción',
      detalle: error.message
    });
  }
}

// Enviar notificaciones cuando se crea un cupo
export async function notificarNuevoCupo(req, res) {
  try {
    const cupoData = req.body;

    if (!cupoData.id || !cupoData.deporte) {
      return res.status(400).json({
        error: 'Datos del cupo incompletos'
      });
    }

    // Obtener usuarios suscritos que coinciden con las preferencias
    const suscripciones = await Notificacion.obtenerSuscripcionesParaCupo(cupoData);

    console.log(`Enviando notificaciones a ${suscripciones.length} usuarios`);

    const notificacion = {
      title: `¡Nuevo cupo de ${cupoData.deporte}!`,
      body: `${cupoData.lugar} - ${cupoData.fecha} a las ${cupoData.hora}`,
      icon: '/icon-192.png',
      badge: '/badge-72.png',
      data: {
        cupoId: cupoData.id,
        url: `/cupo/${cupoData.id}`
      }
    };

    const promesas = suscripciones.map(async (sub) => {
      try {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: sub.keys
        };

        await webpush.sendNotification(
          pushSubscription,
          JSON.stringify(notificacion)
        );

        // Registrar en historial
        await Notificacion.registrarNotificacion(
          sub.usuario_id,
          cupoData.id,
          notificacion.body
        );

        return { success: true, usuario: sub.usuario_id };

      } catch (error) {
        console.error(`Error enviando a ${sub.usuario_id}:`, error);
        
        // Si el endpoint ya no es válido, desactivarlo
        if (error.statusCode === 410) {
          await Notificacion.desactivarSuscripcion(sub.endpoint);
        }

        return { success: false, usuario: sub.usuario_id, error: error.message };
      }
    });

    const resultados = await Promise.all(promesas);
    const exitosas = resultados.filter(r => r.success).length;

    res.json({
      success: true,
      mensaje: `Notificaciones enviadas: ${exitosas}/${suscripciones.length}`,
      resultados
    });

  } catch (error) {
    console.error('Error al notificar nuevo cupo:', error);
    res.status(500).json({
      error: 'Error al enviar notificaciones',
      detalle: error.message
    });
  }
}

// Obtener clave pública VAPID
export function obtenerClavePublica(req, res) {
  res.json({
    publicKey: vapidKeys.publicKey
  });
}

// Enviar notificación de prueba
export async function enviarPrueba(req, res) {
  try {
    const { usuarioId } = req.body;

    if (!usuarioId) {
      return res.status(400).json({
        error: 'usuarioId es requerido'
      });
    }

    // Obtener suscripción del usuario
    const query = `
      SELECT endpoint, keys 
      FROM notificaciones.suscripciones 
      WHERE usuario_id = $1 AND activa = true
      LIMIT 1
    `;
    
    const result = await Notificacion.pool?.query(query, [usuarioId]) 
      || await import('../config/db.js').then(m => m.default.query(query, [usuarioId]));

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'No se encontró suscripción activa para este usuario'
      });
    }

    const sub = result.rows[0];
    const pushSubscription = {
      endpoint: sub.endpoint,
      keys: sub.keys
    };

    const notificacion = {
      title: '🏀 Notificación de Prueba',
      body: '¡Tu sistema de notificaciones funciona correctamente!',
      icon: '/icon-192.png',
      badge: '/badge-72.png'
    };

    await webpush.sendNotification(
      pushSubscription,
      JSON.stringify(notificacion)
    );

    res.json({
      success: true,
      mensaje: 'Notificación de prueba enviada'
    });

  } catch (error) {
    console.error('Error al enviar prueba:', error);
    res.status(500).json({
      error: 'Error al enviar notificación de prueba',
      detalle: error.message
    });
  }
}