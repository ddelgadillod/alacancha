import { Router } from 'express';
import { ultimaCalificacion } from '../controllers/controller.js';
import { verHistorial } from '../controllers/controller.js';
import { crearCalificacion } from '../controllers/controller.js';

const router = Router();

router.get('/historialcalificacion', verHistorial);
router.get('/ultimacalificacion', ultimaCalificacion);
router.post('/calificar', crearCalificacion);

export default router;