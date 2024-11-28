import { Router } from 'express';
import { UserController } from './controller';
import { authMiddleware } from '../../../middlewares/auth/middleware';
import { adminMiddleware } from '../../../middlewares/admin/middleware';

export class UserRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new UserController();

    // Rutas públicas
    router.post('/login', controller.login);

    // Rutas protegidas
    router.use(authMiddleware);
    
    router.get('/', controller.getUsers);
    router.get('/:id', controller.getUser);
    
    // Rutas solo para administradores
    router.use(adminMiddleware);
    
    router.post('/', controller.createUser);
    router.put('/:id', controller.updateUser);
    router.delete('/:id', controller.deleteUser);

    return router;
  }
}
