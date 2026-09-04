import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db.js';

//Importación de rutas
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import clienteRoutes from './routes/clientes.routes.js';
import localRoutes from './routes/locales.routes.js';
import pedidoRoutes from './routes/pedidos.routes.js';
import remitoRoutes from './routes/remitos.routes.js';

const app = express ();

connectDB();

app.use (helmet());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('/{*path', cors())
app.use(express.json())

//configuración de rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/locales', localRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/remitos', remitoRoutes);

export default app;