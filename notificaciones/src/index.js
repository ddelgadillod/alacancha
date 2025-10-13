import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import notifRoutes from './routes/routes.js';
import './config/db.js';

dotenv.config();

const app = express();

// CORS para permitir peticiones desde el frontend
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5500', '*'],
  credentials: true
}));

app.use(express.json());

// Rutas del microservicio
app.use('', notifRoutes);

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'notificaciones',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`🔔 Notificaciones microservice running on port ${PORT}`);
  console.log(`📡 VAPID configured: ${process.env.VAPID_PUBLIC_KEY ? 'Yes' : 'No'}`);
});