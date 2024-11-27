import { Router } from 'express';
import { UserRoutes } from './users/routes';
import { BranchRoutes } from './branchs/routes';
import { TicketRoutes } from './tickets/routes';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // Configuración de las rutas principales
    router.use('/api/users', UserRoutes.routes);
    router.use('/api/branches', BranchRoutes.routes);
    router.use('/api/tickets', TicketRoutes.routes);

    return router;
  }
}