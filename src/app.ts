// app.ts
import express from "express";
import 'dotenv/config';
import cors from 'cors';
import { envs } from "./config/envs.plugin";
import { MongoDatabase } from "./data/init";
import { AppRoutes } from "./presentation/controllers/routes";
import { createDefaultAdmin } from "./data/seed/createDefaultAdmin";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
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

export default app;