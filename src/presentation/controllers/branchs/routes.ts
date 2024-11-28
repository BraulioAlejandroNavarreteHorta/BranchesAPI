import { Router } from 'express';
import { BranchController } from './controller';
import { authMiddleware } from '../../../middlewares/auth/middleware';
import { adminMiddleware } from '../../../middlewares/admin/middleware';

export class BranchRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new BranchController();

    // Todas las rutas requieren autenticación
    router.use(authMiddleware);

    // Rutas de acceso general (requieren autenticación)
    router.get('/', controller.getBranches);
    router.get('/nearby', controller.getNearbyBranches);
    router.get('/:id', controller.getBranchById);

    // Rutas que requieren privilegios de administrador
    router.use(adminMiddleware);
    
    router.post('/', controller.createBranch);
    router.put('/:id', controller.updateBranch);
    router.delete('/:id', controller.deleteBranch);

    return router;
  }
}
