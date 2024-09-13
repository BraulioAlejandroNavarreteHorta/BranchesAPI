import { Request, Response } from 'express';
import { InfectionModel } from '../../../data/models/infection.model';
//import { EmailService } from '../../../domain/services/email.service';

export class InfectionController {
    public getInfections = async (req: Request, res: Response) => {
        try {
            const infections = await InfectionModel.find();
            return res.json(infections);
        } catch (error) {
            return res.status(500).json({ message: "Error al obtener los casos" });
        }
    }

    public getInfectionsLastWeek = async (req: Request, res: Response) => {
        try {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

            const infections = await InfectionModel.find({ creationDate: { $gte: oneWeekAgo } });
            return res.json(infections);
        } catch (error) {
            return res.status(500).json({ message: "Error al obtener los casos de la última semana" });
        }
    }


    public createInfection = async (req: Request, res: Response) => {
        try {
            const { lat, lng, genre, age } = req.body;
            const newInfection = await InfectionModel.create({
                lat,
                lng,
                genre,
                age,
                creationDate: new Date(),
                isSent: false
            });
            res.json(newInfection);
        } catch (error) {
            return res.status(500).json({ message: "Error al crear el caso" });
        }
    }

  
    public getInfectionById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const infection = await InfectionModel.findById(id);
            if (!infection) {
                return res.status(404).json({ message: "Caso no encontrado" });
            }
            return res.json(infection);
        } catch (error) {
            return res.status(500).json({ message: "Error al obtener el caso" });
        }
    }

    
    public updateInfection = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { lat, lng, genre, age, isSent } = req.body;

            const updatedInfection = await InfectionModel.findByIdAndUpdate(
                id,
                { lat, lng, genre, age, isSent },
                { new: true }
            );

            if (!updatedInfection) {
                return res.status(404).json({ message: "Caso no encontrado" });
            }

            return res.json(updatedInfection);
        } catch (error) {
            return res.status(500).json({ message: "Error al actualizar el caso" });
        }
    }

    
    public deleteInfection = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const infection = await InfectionModel.findByIdAndDelete(id);

            if (!infection) {
                return res.status(404).json({ message: "Caso no encontrado" });
            }
            return res.json({ message: "Caso eliminado" });
        } catch (error) {
            return res.status(500).json({ message: "Error al eliminar el caso" });
        }
    }
}
