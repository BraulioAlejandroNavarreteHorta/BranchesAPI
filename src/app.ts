// app.ts
import express from "express";
import 'dotenv/config';
import cors from 'cors';
import { envs } from "./config/envs.plugin";
import { MongoDatabase } from "./data/init";
import { AppRoutes } from "./presentation/controllers/routes";
import { createDefaultAdmin } from "./data/seed/createDefaultAdmin";
import { EmailService } from "./domain/services/email.service";

const app = express();
const emailService = new EmailService();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
});

// Rutas de la API
app.use(AppRoutes.routes);

// Conexión a DB e inicialización
(async () => {
  try {
    await MongoDatabase.connect({
      dbName: "TicketManagementDB",
      mongoUrl: envs.MONGO_URL ?? ""
    });
    console.log('Base de datos conectada correctamente');

    await createDefaultAdmin();
    console.log('Usuario administrador verificado');

    await emailService.verifyConnection();
    console.log('Servicio de email configurado correctamente');

  } catch (error) {
    console.error('Error al inicializar:', error);
    process.exit(1);
  }
})();

// Iniciar servidor
app.listen(envs.PORT, () => {
  console.log(`Servidor corriendo en el puerto ${envs.PORT}`);
});

// Manejo de errores no controlados
process.on('unhandledRejection', (error: Error) => {
  console.error('Error no controlado:', error);
});

process.on('SIGTERM', () => {
  console.log('Señal SIGTERM recibida. Cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Señal SIGINT recibida. Cerrando servidor...');
  process.exit(0);
});

export default app;

//TEST GITHUB ACTIONS