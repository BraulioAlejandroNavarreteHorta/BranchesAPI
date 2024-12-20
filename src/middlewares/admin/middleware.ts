import { Request, Response, NextFunction } from 'express';

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ 
      message: 'Acceso denegado. Se requieren privilegios de administrador' 
    });
  }
  next();
};