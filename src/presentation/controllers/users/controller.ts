import { Request, Response } from 'express';
import { UserModel } from '../../../data/models/user/model';
import { IUser } from '../../../data/models/interfaces/user.interface';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export class UserController {
    public async login(req: Request, res: Response) {
        try {
          const { email, password } = req.body;
          const user = await UserModel.findOne({ email });
    
          if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Credenciales inválidas" });
          }
    
          const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
          );
    
          user.lastLogin = new Date();
          await user.save();
    
          return res.json({
            token,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              branch: user.branch
            }
          });
        } catch (error) {
          return res.status(500).json({ message: "Error en el servidor" });
        }
      }
    

  public async createUser(req: Request, res: Response) {
    try {
      const userData = req.body;
      const user = await UserModel.create(userData);

      return res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch: user.branch
      });
    } catch (error: any) {
      if (error.code === 11000) {
        return res.status(400).json({ message: "El email ya está registrado" });
      }
      return res.status(500).json({ message: "Error al crear el usuario" });
    }
  }

  public async getUsers(req: Request, res: Response) {
    try {
      const { branch, role, active } = req.query;
      const filter: any = {};

      if (branch) filter.branch = branch;
      if (role) filter.role = role;
      if (active !== undefined) filter.isActive = active === 'true';

      const users = await UserModel.find(filter)
        .select('-password')
        .populate('branch', 'name code');

      return res.json(users);
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener usuarios" });
    }
  }

  public async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };

      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }

      const user = await UserModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: "Error al actualizar usuario" });
    }
  }

  public async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await UserModel.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      return res.json({ message: "Usuario desactivado correctamente" });
    } catch (error) {
      return res.status(500).json({ message: "Error al desactivar usuario" });
    }
  }
}
