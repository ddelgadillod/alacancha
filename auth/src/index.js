import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/routes.js';
import './config/db.js'; // inicializa la conexión a la BD

dotenv.config(); // lee .env

const app = express();
app.use(express.json());

// Rutas del microservicio
app.use('', authRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Auth microservice running on port ${PORT}`));