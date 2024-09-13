import { Request, Response } from 'express';
import { InfectionModel } from '../../../data/models/infection.model';
//import { EmailService } from '../../../domain/services/email.service';

export class InfectionController {

    public getInfections = async (req: Request, res: Response) => {
        // try {
        //     const incidents = await InfectionModel.find();
        //     return res.json(incidents);

        // } catch (error) {
        //     return res.status(500).json({ message: "Error al obtener los incidentes" })
        // }
    }

    public createInfections = async (req: Request, res: Response) => {
        // try {
        //     const { title, description, lat, lng } = req.body
        //     const newIncident = await InfectionModel.create({
        //         title,
        //         description,
        //         lat,
        //         lng
        //     });
        //     // const emailService = new EmailService();
        //     // await emailService.sendEmail({
        //     //     to:"braulioalejandronavarretehorta@gmail.com",
        //     //     subject:`Incidente:${newIncident.title}`,
        //     //     htmlBody:`<h1>${newIncident.description}</h1>`,
        //     // });
        //     res.json(newIncident);
        // } catch (error) {
        //     return res.status(500).json({ message: "Error al crear el incidente" })
        // }
    }

    public getInfectionById = async (req: Request, res: Response) => {
        // try{
        //     const { id } = req.params;
        //     const incident = await InfectionModel.findById(id);
        //     if(!incident){
        //         return res.status(404).json({message: "Incidente no encontrado"})
        //     }
        //     return res.json(incident);

        // }catch(error){
        //     return res.status(500).json({message: "Error al obtener el incidente"})
        // }
    }

    public updateInfections = async (req: Request, res: Response) => {
        // try{
        //     const { id } = req.params;
        //     const { title, description, lat, lng } = req.body;
        //     await InfectionModel.findByIdAndUpdate(id,
        //         {
        //             title:title, 
        //             description:description, 
        //             lat:lat, 
        //             lng:lng
        //         });

        //     const incident = await InfectionModel.findById(id);
        //     return res.json(incident);

        // }catch(error){
        //     return res.status(500).json({message: "Error al actualizar el incidente"})
        // }
    }

    public deleteInfection = async (req: Request, res: Response) => {
        // try{
        //     const { id } = req.params;
        //     const incident = await InfectionModel.findByIdAndDelete(id);

        //     if(!incident){
        //         return res.status(404).json({message: "Incidente no encontrado"})
        //     }
        //     return res.json({message: "Incidente eliminado"});

        // }catch(error){
        //     return res.status(500).json({message: "Error al eliminar el incidente"})
        // }
    }
}