// app.ts
import express from "express";
import 'dotenv/config';
import cors from 'cors';
import { envs } from "./config/envs.plugin";
import { MongoDatabase } from "./data/init";
import { AppRoutes } from "./presentation/controllers/routes";

// Inicialización de la aplicación
const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api', AppRoutes.routes);

// Ruta de health check
app.get("/health-check", (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Conexión a la base de datos
(async () => {
  try {
    await MongoDatabase.connect({
      dbName: "BranchManagementDB",
      mongoUrl: envs.MONGO_URL ?? ""
    });
    console.log('📦 Base de datos conectada correctamente');
  } catch (error) {
    console.error('Error al conectar la base de datos:', error);
    process.exit(1);
  }
})();

// Iniciar el servidor
app.listen(envs.PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${envs.PORT}`);
});

// Manejo de errores no controlados
process.on('unhandledRejection', (error: Error) => {
  console.error('Error no controlado:', error);
});

export default app;