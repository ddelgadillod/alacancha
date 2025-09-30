import { Router } from 'express';
import {findSpot} from '../controllers/controller.js';
import { getHistorialParticipacion } from '../controllers/controller.js';
import { crearCupo } from '../controllers/controller.js';
import { obtenerCupo } from '../controllers/controller.js';
import { buscarCupos } from '../controllers/controller.js';
import { participarEnCupo } from '../controllers/controller.js';    


const router = Router();

router.post('/findspot', findSpot);
router.get('/historial', getHistorialParticipacion);
router.post('/crearcupos', crearCupo);
router.get('/buscarcupos', buscarCupos);
router.get('/obtenercupos', obtenerCupo);
router.post('/participarcupo', participarEnCupo);

export default router;