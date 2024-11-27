import { Request, Response } from 'express';
import { BranchModel } from '../../../data/models/branch/model';

export class BranchController {
  public async createBranch(req: Request, res: Response) {
    try {
      const branch = await BranchModel.create(req.body);
      await branch.populate('manager', 'name email');
      
      return res.status(201).json(branch);
    } catch (error: any) {
      if (error.code === 11000) {
        return res.status(400).json({ message: "El código de sucursal ya existe" });
      }
      return res.status(500).json({ message: "Error al crear la sucursal" });
    }
  }

  public async getBranches(req: Request, res: Response) {
    try {
      const { active, manager } = req.query;
      const filter: any = {};

      if (active !== undefined) filter.isActive = active === 'true';
      if (manager) filter.manager = manager;

      const branches = await BranchModel.find(filter)
        .populate('manager', 'name email');

      return res.json(branches);
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener sucursales" });
    }
  }

  public async getNearbyBranches(req: Request, res: Response) {
    try {
      const { longitude, latitude, maxDistance = 10000 } = req.query;

      const branches = await BranchModel.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(longitude), Number(latitude)]
            },
            $maxDistance: Number(maxDistance)
          }
        },
        isActive: true
      }).populate('manager', 'name email');

      return res.json(branches);
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener sucursales cercanas" });
    }
  }

  public async updateBranch(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const branch = await BranchModel.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      ).populate('manager', 'name email');

      if (!branch) {
        return res.status(404).json({ message: "Sucursal no encontrada" });
      }

      return res.json(branch);
    } catch (error) {
      return res.status(500).json({ message: "Error al actualizar sucursal" });
    }
  }

  public async deleteBranch(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const branch = await BranchModel.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );

      if (!branch) {
        return res.status(404).json({ message: "Sucursal no encontrada" });
      }

      return res.json({ message: "Sucursal desactivada correctamente" });
    } catch (error) {
      return res.status(500).json({ message: "Error al desactivar sucursal" });
    }
  }
}