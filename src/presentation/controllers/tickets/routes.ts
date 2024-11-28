import { Router } from 'express';
import { TicketController } from './controller';
import { authMiddleware } from '../../../middlewares/auth/middleware';

export class TicketRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new TicketController();

    // Todas las rutas requieren autenticación
    router.use(authMiddleware);

    // Ruta para obtener todos los tickets con filtros opcionales
    router.get('/', controller.getTickets);

    // Ruta para obtener tickets por ubicación
    router.get('/by-location', controller.getTicketsByLocation);

    // Ruta para obtener un ticket específico
    router.get('/:id', controller.getTicketById);

    // Ruta para crear un nuevo ticket
    router.post('/', controller.createTicket);

    // Ruta para actualizar un ticket
    router.put('/:id', controller.updateTicket);

    // Ruta para eliminar/cancelar un ticket
    router.delete('/:id', controller.deleteTicket);

    return router;
  }
}