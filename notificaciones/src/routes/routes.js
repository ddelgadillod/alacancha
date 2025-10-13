import { Router } from 'express';
import { 
  suscribir, 
  notificarNuevoCupo, 
  obtenerClavePublica,
  enviarPrueba 
} from '../controllers/controller.js';const router = Router();

// Obtener clave pública VAPID para el cliente
router.get('/vapid-public-key', obtenerClavePublica);

// Suscribir usuario a notificaciones push
router.post('/suscribir', suscribir);

// Notificar nuevo cupo (llamado desde spot service)
router.post('/notificar-cupo', notificarNuevoCupo);

// Enviar notificación de prueba
router.post('/prueba', enviarPrueba);

export default router;