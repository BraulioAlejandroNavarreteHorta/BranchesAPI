import { Request, Response } from 'express';
import { TicketModel } from '../../../data/models/ticket/model';

export class TicketController {
    public async createTicket(req: Request, res: Response) {
        try {
          const count = await TicketModel.countDocuments();
          const ticketNumber = `TK-${String(count + 1).padStart(6, '0')}`;
    
          const ticketData = {
            ...req.body,
            ticketNumber,
            timeline: [{
              status: 'PENDING',
              comment: 'Ticket creado',
              updatedBy: req.body.createdBy
            }]
          };
    
          const ticket = await TicketModel.create(ticketData);
          
          await ticket.populate([
            { path: 'branch', select: 'name code' },
            { path: 'createdBy', select: 'name email' },
            { path: 'assignedTo', select: 'name email' }
          ]);
    
          return res.status(201).json(ticket);
        } catch (error) {
          console.error('Error completo:', error);
          return res.status(500).json({ 
            message: "Error al crear el ticket",
            //@ts-ignore
            error: error.message
          });
        }
    }

  public async getTickets(req: Request, res: Response) {
    try {
      const {
        branch, status, priority,
        startDate, endDate,
        assignedTo, createdBy
      } = req.query;

      const filter: any = {};

      if (branch) filter.branch = branch;
      if (status) filter.status = status;
      if (priority) filter.priority = priority;
      if (assignedTo) filter.assignedTo = assignedTo;
      if (createdBy) filter.createdBy = createdBy;

      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate as string);
        if (endDate) filter.createdAt.$lte = new Date(endDate as string);
      }

      const tickets = await TicketModel.find(filter)
        .populate('branch', 'name code')
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .sort('-createdAt');

      return res.json(tickets);
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener tickets" });
    }
  }

  public async getTicketById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const ticket = await TicketModel.findById(id)
        .populate('branch', 'name code')
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .populate('timeline.updatedBy', 'name email');

      if (!ticket) {
        return res.status(404).json({ message: "Ticket no encontrado" });
      }

      return res.json(ticket);
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener el ticket" });
    }
  }

  public async updateTicket(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { status, comment, updatedBy, ...updateData } = req.body;

        // Verificar si existe el ticket
        const currentTicket = await TicketModel.findById(id);
        if (!currentTicket) {
            return res.status(404).json({ message: "Ticket no encontrado" });
        }

        // Preparar los datos de actualización
        const updateObj: any = { ...updateData };

        if (status) {
            updateObj.status = status;
            
            // Crear nueva entrada en el timeline
            const timelineEntry = {
                status,
                comment: comment || `Estado actualizado a ${status}`,
                updatedBy,
                timestamp: new Date()
            };

            // Si el status es CLOSED, calcular el tiempo de resolución
            if (status === 'CLOSED') {
                updateObj.closedAt = new Date();
                updateObj.resolutionTime = Math.floor(
                    (updateObj.closedAt.getTime() - currentTicket.createdAt.getTime()) / 60000
                );
            }

            // Usar $push para agregar al timeline
            updateObj.$push = { timeline: timelineEntry };
        }

        // Actualizar el ticket
        const ticket = await TicketModel.findByIdAndUpdate(
            id,
            updateObj,
            {
                new: true,
                runValidators: true
            }
        ).populate([
            { 
                path: 'branch', 
                select: 'name code manager',
                populate: { 
                    path: 'manager',
                    select: 'email'
                }
            },
            { path: 'createdBy', select: 'name email' },
            { path: 'assignedTo', select: 'name email' },
            { path: 'timeline.updatedBy', select: 'name email' }
        ]);

        return res.json(ticket);
    } catch (error) {
        console.error('Error al actualizar ticket:', error);
        return res.status(500).json({
            message: "Error al actualizar ticket",
            //@ts-ignore
            error: error.message
        });
    }
}

  public async deleteTicket(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const ticket = await TicketModel.findByIdAndUpdate(
        id,
        { status: 'CANCELLED' },
        { new: true }
      );

      if (!ticket) {
        return res.status(404).json({ message: "Ticket no encontrado" });
      }

      return res.json({ message: "Ticket cancelado correctamente" });
    } catch (error) {
      return res.status(500).json({ message: "Error al cancelar ticket" });
    }
  }

  public async getTicketsByLocation(req: Request, res: Response) {
    try {
      const { longitude, latitude, maxDistance = 5000 } = req.query;

      const tickets = await TicketModel.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(longitude), Number(latitude)]
            },
            $maxDistance: Number(maxDistance)
          }
        }
      })
      .populate('branch', 'name code')
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

      return res.json(tickets);
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener tickets por ubicación" });
    }
  }
}
